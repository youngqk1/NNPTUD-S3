
// ==================== BÀI TẬP SẢN PHẨM ====================

// Câu 1: Khai báo constructor function Product
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// Câu 2: Khởi tạo mảng products với ít nhất 6 sản phẩm, tối thiểu 2 danh mục
let products = [
    new Product(1, "iPhone 15 Pro Max", 35000000, 10, "Electronics", true),
    new Product(2, "Samsung Galaxy S24", 28000000, 15, "Electronics", true),
    new Product(3, "MacBook Pro M3", 45000000, 5, "Electronics", true),
    new Product(4, "iPad Air", 18000000, 0, "Electronics", false),
    new Product(5, "AirPods Pro", 6000000, 20, "Accessories", true),
    new Product(6, "Apple Watch Series 9", 12000000, 8, "Accessories", true),
    new Product(7, "Magic Mouse", 2500000, 12, "Accessories", true),
    new Product(8, "USB-C Cable", 500000, 0, "Accessories", true)
];

console.log("=== DANH SÁCH SẢN PHẨM ===");
console.log(products);
console.log("\n");

// Câu 3: Tạo mảng mới chỉ chứa name và price
let nameAndPrice = products.map(product => ({
    name: product.name,
    price: product.price
}));

console.log("=== CÂU 3: TÊN VÀ GIÁ SẢN PHẨM ===");
console.log(nameAndPrice);
console.log("\n");

// Câu 4: Lọc ra các sản phẩm còn hàng trong kho (quantity > 0)
let inStockProducts = products.filter(product => product.quantity > 0);

console.log("=== CÂU 4: SẢN PHẨM CÒN HÀNG ===");
console.log(inStockProducts);
console.log("\n");

// Câu 5: Kiểm tra xem có ít nhất một sản phẩm có giá trên 30.000.000
let hasExpensiveProduct = products.some(product => product.price > 30000000);

console.log("=== CÂU 5: CÓ SẢN PHẨM GIÁ TRÊN 30 TRIỆU ===");
console.log(hasExpensiveProduct ? "Có" : "Không");
console.log("\n");

// Câu 6: Kiểm tra xem tất cả sản phẩm thuộc danh mục "Accessories" có đang được bán
let allAccessoriesAvailable = products
    .filter(product => product.category === "Accessories")
    .every(product => product.isAvailable === true);

console.log("=== CÂU 6: TẤT CẢ PHỤ KIỆN ĐANG BÁN ===");
console.log(allAccessoriesAvailable ? "Đúng" : "Sai");
console.log("\n");

// Câu 7: Tính tổng giá trị kho hàng (price * quantity)
let totalInventoryValue = products.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
}, 0);

console.log("=== CÂU 7: TỔNG GIÁ TRỊ KHO HÀNG ===");
console.log(`${totalInventoryValue.toLocaleString('vi-VN')} VNĐ`);
console.log("\n");

// Câu 8: Dùng for...of để in ra: Tên sản phẩm - Danh mục - Trạng thái
console.log("=== CÂU 8: DUYỆT SẢN PHẨM VỚI FOR...OF ===");
for (const product of products) {
    let status = product.isAvailable ? "Đang bán" : "Ngừng bán";
    console.log(`${product.name} - ${product.category} - ${status}`);
}
console.log("\n");

// Câu 9: Dùng for...in để in ra tên thuộc tính và giá trị
console.log("=== CÂU 9: DUYỆT THUỘC TÍNH VỚI FOR...IN ===");
console.log("Thông tin sản phẩm đầu tiên:");
for (const key in products[0]) {
    if (products[0].hasOwnProperty(key)) {
        console.log(`Thuộc tính: ${key} - Giá trị: ${products[0][key]}`);
    }
}
console.log("\n");

// Câu 10: Lấy danh sách tên các sản phẩm đang bán và còn hàng
let availableAndInStock = products
    .filter(product => product.isAvailable === true && product.quantity > 0)
    .map(product => product.name);

console.log("=== CÂU 10: SẢN PHẨM ĐANG BÁN VÀ CÒN HÀNG ===");
console.log(availableAndInStock);
console.log("\n");

console.log("=== HOÀN THÀNH TẤT CẢ 10 BÀI TẬP ===");