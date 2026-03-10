require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./schemas/products');
const Category = require('./schemas/categories');
const slugify = require('slugify');

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Đã kết nối MongoDB để nạp dữ liệu...");

        // Xóa dữ liệu cũ
        await Product.deleteMany({});
        await Category.deleteMany({});

        // Tạo Categories
        const categories = await Category.insertMany([
            { name: "Điện thoại", slug: "dien-thoai" },
            { name: "Máy tính", slug: "may-tinh" },
            { name: "Âm thanh", slug: "am-thanh" }
        ]);
        console.log("Đã tạo 3 danh mục mẫu!");

        // Tạo Products
        const seedProducts = [
            {
                title: "iPhone 15 Pro",
                slug: "iphone-15-pro",
                price: 999,
                description: "Chip A17 Pro, Camera 48MP, Khung Titan.",
                category: categories[0]._id,
                images: ["https://placehold.co/600x400?text=iPhone+15+Pro"]
            },
            {
                title: "MacBook Air M2",
                slug: "macbook-air-m2",
                price: 1199,
                description: "Mỏng nhẹ, mạnh mẽ với chip M2, màn hình Liquid Retina.",
                category: categories[1]._id,
                images: ["https://placehold.co/600x400?text=MacBook+Air"]
            },
            {
                title: "Sony WH-1000XM5",
                slug: "sony-wh-1000xm5",
                price: 349,
                description: "Tai nghe chống ồn tốt nhất thế giới.",
                category: categories[2]._id,
                images: ["https://placehold.co/600x400?text=Sony+XM5"]
            }
        ];

        await Product.insertMany(seedProducts);
        console.log("Đã nạp thành công 3 sản phẩm mẫu!");

        process.exit();
    } catch (err) {
        console.error("Lỗi khi nạp dữ liệu:", err);
        process.exit(1);
    }
}

seedDB();
