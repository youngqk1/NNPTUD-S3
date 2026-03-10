const express = require('express');
let router = express.Router();
let User = require('../schemas/users');

// ==================== USER ROUTES ====================

// GET all users (có query theo username - includes/contains)
// GET /api/v1/users
// GET /api/v1/users?username=nguyen  → tìm kiếm gần đúng, không phân biệt hoa thường
router.get('/', async (req, res) => {
    try {
        let filter = { isDeleted: false };

        if (req.query.username) {
            filter.username = { $regex: req.query.username, $options: 'i' };
        }

        let users = await User.find(filter).populate('role');
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// GET user by id
// GET /api/v1/users/:id
router.get('/:id', async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) {
            return res.status(404).send({ message: 'User không tìm thấy' });
        }
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// POST create user
// POST /api/v1/users
router.post('/', async (req, res) => {
    try {
        let newUser = new User({
            username:   req.body.username,
            password:   req.body.password,
            email:      req.body.email,
            fullName:   req.body.fullName,
            avatarUrl:  req.body.avatarUrl,
            status:     req.body.status,
            role:       req.body.role,
            loginCount: req.body.loginCount
        });
        let result = await newUser.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// ⚠️ /enable và /disable đặt TRƯỚC /:id để tránh conflict tham số
// POST /api/v1/users/enable — Kích hoạt tài khoản (status -> true)
// Body: { email, username }
router.post('/enable', async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).send({ message: 'Vui lòng cung cấp email và username' });
        }

        let user = await User.findOne({
            email:     email.toLowerCase().trim(),
            username:  username.trim(),
            isDeleted: false
        });

        if (!user) {
            return res.status(404).send({ message: 'Thông tin email hoặc username không đúng' });
        }

        if (user.status === true) {
            return res.status(400).send({ message: 'Tài khoản đã được kích hoạt trước đó' });
        }

        user.status = true;
        await user.save();

        res.send({ message: 'Kích hoạt tài khoản thành công', user });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// POST /api/v1/users/disable — Vô hiệu hoá tài khoản (status -> false)
// Body: { email, username }
router.post('/disable', async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).send({ message: 'Vui lòng cung cấp email và username' });
        }

        let user = await User.findOne({
            email:     email.toLowerCase().trim(),
            username:  username.trim(),
            isDeleted: false
        });

        if (!user) {
            return res.status(404).send({ message: 'Thông tin email hoặc username không đúng' });
        }

        if (user.status === false) {
            return res.status(400).send({ message: 'Tài khoản đã bị vô hiệu hoá trước đó' });
        }

        user.status = false;
        await user.save();

        res.send({ message: 'Vô hiệu hoá tài khoản thành công', user });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// PUT update user
// PUT /api/v1/users/:id
router.put('/:id', async (req, res) => {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        ).populate('role');
        if (!user) {
            return res.status(404).send({ message: 'User không tìm thấy' });
        }
        res.send(user);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// DELETE user — xoá mềm (isDeleted: true)
// DELETE /api/v1/users/:id
router.delete('/:id', async (req, res) => {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ message: 'User không tìm thấy hoặc đã bị xoá' });
        }
        res.send({ message: 'Xoá user thành công', user });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
