async function getData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById('table_body');
        body.innerHTML = '';
        for (const post of posts) {
            const isDeleted = post.isDeleted || false;
            const rowStyle = isDeleted ? 'style="text-decoration: line-through; color: #999;"' : '';
            body.innerHTML += `<tr ${rowStyle}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td><input type='submit' value='Delete' onclick='
                Delete(${post.id})'></td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}
async function Save() {
    let id = document.getElementById('txt_id').value;
    let title = document.getElementById('txt_title').value;
    let views = document.getElementById('txt_views').value;

    if (id && id.trim() !== '') {
        // Edit - có ID
        let getItem = await fetch('http://localhost:3000/posts/' + id);
        if (getItem.ok) {
            let res = await fetch('http://localhost:3000/posts/' + id, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    views: views
                })
            })
            if (res.ok) {
                console.log("thanh cong");
                getData();
            }
        }
    } else {
        // Create - không có ID hoặc ID rỗng
        // Lấy tất cả posts để tìm maxId
        let allPostsRes = await fetch('http://localhost:3000/posts');
        let allPosts = await allPostsRes.json();
        let maxId = 0;
        for (const post of allPosts) {
            let postId = parseInt(post.id);
            if (!isNaN(postId) && postId > maxId) {
                maxId = postId;
            }
        }
        let newId = (maxId + 1).toString();

        let res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        })
        if (res.ok) {
            console.log("thanh cong");
            getData();
        }
    }
}
async function Delete(id) {
    // Xoá mềm bằng cách cập nhật isDeleted = true
    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        })
        if (res.ok) {
            console.log("xoa thanh cong");
            getData();
        }
    }
}
getData();

