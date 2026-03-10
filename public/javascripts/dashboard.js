/* ============================================================
   Product Dashboard – dashboard.js (NNPTUD-S3 version)
   API: /api/v1/products
   ============================================================ */

const API_URL = '/api/v1/products';

// ── State ────────────────────────────────────────────────────
let allProducts = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortField = null;
let sortDir = 'asc';
let searchQuery = '';

// ── DOM refs ─────────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchStatus = document.getElementById('searchStatus');
const limitSelect = document.getElementById('limitSelect');
const tableBody = document.getElementById('tableBody');
const paginationUl = document.getElementById('paginationUl');
const paginationInfo = document.getElementById('paginationInfo');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorState = document.getElementById('errorState');
const emptyState = document.getElementById('emptyState');
const tableWrapper = document.getElementById('tableWrapper');
const totalBadge = document.getElementById('totalBadge');
const statFiltered = document.getElementById('statFiltered');
const statTotal = document.getElementById('statTotal');
const descTooltip = document.getElementById('descTooltip');
const descTooltipBody = document.getElementById('descTooltipBody');

// Form refs
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const idInput = document.getElementById('productId');
const titleInput = document.getElementById('titleInput');
const priceInput = document.getElementById('priceInput');
const catIdInput = document.getElementById('catIdInput');
const imageInput = document.getElementById('imageInput');
const descInput = document.getElementById('descInput');

const toastLive = document.getElementById('liveToast');
const toastMsg = document.getElementById('toastMessage');

// ── Fetch ─────────────────────────────────────────────────────
async function fetchProducts() {
    showState('loading');
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Use _id for consistency
        allProducts = data.map(p => ({ ...p, id: p._id }));

        totalBadge.innerHTML = `<i class="bi bi-box-seam me-1"></i>${allProducts.length} sản phẩm`;
        statTotal.textContent = allProducts.length;
        applyFilters();
    } catch (err) {
        console.error('Fetch error:', err);
        showState('error');
    }
}

// ── Filters & Sort ────────────────────────────────────────────
function applyFilters() {
    const q = searchQuery.trim().toLowerCase();

    filteredData = q
        ? allProducts.filter(p => p.title.toLowerCase().includes(q))
        : [...allProducts];

    if (sortField) {
        filteredData.sort((a, b) => {
            let va = sortField === 'price' ? +a.price : (a.title || '').toLowerCase();
            let vb = sortField === 'price' ? +b.price : (b.title || '').toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }

    currentPage = 1;
    statFiltered.textContent = filteredData.length;

    if (filteredData.length === 0 && q) {
        showState('empty');
    } else if (filteredData.length === 0) {
        showState('table');
        renderTable();
    } else {
        showState('table');
        renderTable();
        renderPagination();
    }
}

// ── Render Table ──────────────────────────────────────────────
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const slice = filteredData.slice(start, start + itemsPerPage);
    const q = searchQuery.trim().toLowerCase();

    if (slice.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted small">Không có dữ liệu hiển thị.</td></tr>`;
        return;
    }

    tableBody.innerHTML = slice.map((p, i) => {
        const idx = start + i + 1;
        const title = highlight(escHtml(p.title), q);
        const imgUrl = Array.isArray(p.images) && p.images.length > 0 ? cleanImageUrl(p.images[0]) : cleanImageUrl(p.images);
        const imgHtml = imgUrl
            ? `<img src="${imgUrl}" class="product-img" alt="${escHtml(p.title)}" onerror="this.src='https://placehold.co/100x100?text=No+Image'">`
            : `<div class="img-fallback"><i class="bi bi-image"></i></div>`;

        const catName = p.category?.name || p.category || '—';
        const desc = escHtml(p.description || 'Không có mô tả.');

        return `
      <tr data-desc="${desc}" data-id="${p.id}">
        <td><span class="row-num">${idx}</span></td>
        <td>${imgHtml}</td>
        <td>
          <div class="product-title">${title}</div>
          <span class="desc-hover-hint">
            <i class="bi bi-eye me-1"></i>Di chuyển để xem mô tả
          </span>
        </td>
        <td><span class="price-badge">$${(+p.price).toLocaleString('en')}</span></td>
        <td><span class="category-badge">${escHtml(catName)}</span></td>
        <td>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="openEditModal('${p.id}')">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p.id}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');

    tableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('mouseenter', onRowEnter);
        row.addEventListener('mouseleave', onRowLeave);
        row.addEventListener('mousemove', onRowMove);
    });
}

// ── Tooltip ───────────────────────────────────────────────────
let tooltipTimeout;
function onRowEnter(e) {
    const desc = this.dataset.desc;
    if (!desc) return;
    descTooltipBody.textContent = desc;
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
        positionTooltip(e);
        descTooltip.classList.add('visible');
    }, 120);
}
function onRowMove(e) { positionTooltip(e); }
function onRowLeave() {
    clearTimeout(tooltipTimeout);
    descTooltip.classList.remove('visible');
}
function positionTooltip(e) {
    const tw = 320;
    const th = descTooltip.offsetHeight || 120;
    let x = e.clientX + 16;
    let y = e.clientY + 16;
    if (x + tw > window.innerWidth - 8) x = e.clientX - tw - 16;
    if (y + th > window.innerHeight - 8) y = e.clientY - th - 16;
    descTooltip.style.left = x + 'px';
    descTooltip.style.top = y + 'px';
}

// ── Pagination ────────────────────────────────────────────────
function renderPagination() {
    const total = filteredData.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);

    paginationInfo.innerHTML = `Hiển thị <strong>${total > 0 ? start : 0}–${end}</strong> / <strong>${total}</strong>`;

    const range = buildPageRange(currentPage, pages);
    paginationUl.innerHTML = [
        `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="goPage(${currentPage - 1})"><i class="bi bi-chevron-left"></i></a>
    </li>`,
        ...range.map(p =>
            p === '...'
                ? `<li class="page-item disabled"><span class="page-link">…</span></li>`
                : `<li class="page-item ${p === currentPage ? 'active' : ''}">
             <a class="page-link" href="#" onclick="goPage(${p})">${p}</a>
           </li>`
        ),
        `<li class="page-item ${currentPage === pages || pages === 0 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="goPage(${currentPage + 1})"><i class="bi bi-chevron-right"></i></a>
    </li>`
    ].join('');
}

function buildPageRange(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    if (cur <= 4) pages.push(1, 2, 3, 4, 5, '...', total);
    else if (cur >= total - 3) pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    else pages.push(1, '...', cur - 1, cur, cur + 1, '...', total);
    return pages;
}

function goPage(p) {
    event.preventDefault();
    const pages = Math.ceil(filteredData.length / itemsPerPage);
    if (p < 1 || p > pages) return;
    currentPage = p;
    renderTable();
    renderPagination();
}

// ── CRUD Actions ──────────────────────────────────────────────
function openAddModal() {
    modalTitle.textContent = 'Thêm sản phẩm mới';
    productForm.reset();
    idInput.value = '';
    productModal.show();
}

function openEditModal(id) {
    const p = allProducts.find(item => item.id === id);
    if (!p) return;
    modalTitle.textContent = 'Cập nhật sản phẩm';
    idInput.value = p.id;
    titleInput.value = p.title;
    priceInput.value = p.price;
    catIdInput.value = p.category?._id || p.category;
    imageInput.value = Array.isArray(p.images) ? p.images[0] : p.images;
    descInput.value = p.description;
    productModal.show();
}

async function saveProduct() {
    if (!productForm.checkValidity()) {
        productForm.reportValidity();
        return;
    }

    const id = idInput.value;
    const payload = {
        title: titleInput.value,
        price: Number(priceInput.value),
        category: catIdInput.value,
        images: [imageInput.value],
        description: descInput.value
    };

    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to save');

        showToast(id ? 'Đã cập nhật sản phẩm!' : 'Đã thêm sản phẩm mới!');
        productModal.hide();
        fetchProducts();
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi lưu sản phẩm.');
    }
}

async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Đã xóa sản phẩm thành công!');
        fetchProducts();
    } catch (err) {
        console.error(err);
        alert('Lỗi khi xóa!');
    }
}

function showToast(msg) {
    toastMsg.textContent = msg;
    const toast = new bootstrap.Toast(toastLive);
    toast.show();
}

// ── Sort ──────────────────────────────────────────────────────
function toggleSort(field) {
    if (sortField === field) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortField = field; sortDir = 'asc'; }
    updateSortUI();
    applyFilters();
}

function updateSortUI() {
    const tIcon = document.getElementById('sortTitleIcon');
    const tIconTh = document.getElementById('sortTitleIconTh');
    const pIcon = document.getElementById('sortPriceIcon');
    const pIconTh = document.getElementById('sortPriceIconTh');

    if (tIcon && pIcon && tIconTh && pIconTh) {
        [tIcon, pIcon, tIconTh, pIconTh].forEach(ic => ic.className = 'bi bi-arrow-down-up sort-icon ms-1');

        if (!sortField) return;
        const dirClass = sortDir === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
        if (sortField === 'title') {
            tIcon.className = tIconTh.className = `bi ${dirClass} sort-icon ms-1`;
        } else {
            pIcon.className = pIconTh.className = `bi ${dirClass} sort-icon ms-1`;
        }
    }
}

// ── State helpers ─────────────────────────────────────────────
function showState(state) {
    loadingSpinner.classList.toggle('d-none', state !== 'loading');
    errorState.classList.toggle('d-none', state !== 'error');
    emptyState.classList.toggle('d-none', state !== 'empty');
    tableWrapper.classList.toggle('d-none', state !== 'table');
}

// ── Utils ─────────────────────────────────────────────────────
function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function highlight(html, q) {
    if (!q) return html;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return html.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>');
}

function cleanImageUrl(url) {
    if (!url) return null;
    if (typeof url === 'string') {
        let cleaned = url.trim().replace(/^\[?"?/, '').replace(/"?\]?$/, '').trim();
        if (cleaned.startsWith('http')) return cleaned;
    }
    return null;
}

// ── Event Listeners ────────────────────────────────────────────
searchInput.addEventListener('input', function () {
    searchQuery = this.value;
    clearSearchBtn.classList.toggle('d-none', !searchQuery);
    applyFilters();
});

clearSearchBtn.addEventListener('click', function () {
    searchInput.value = '';
    searchQuery = '';
    this.classList.add('d-none');
    applyFilters();
});

limitSelect.addEventListener('change', function () {
    itemsPerPage = +this.value;
    currentPage = 1;
    applyFilters();
});

// ── Boot ──────────────────────────────────────────────────────
fetchProducts();
