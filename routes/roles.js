const express = require('express');
let router = express.Router();
let Role = require('../schemas/roles');
let User = require('../schemas/users');

// ==================== ROLE ROUTES ====================

// GET all roles
router.get('/', async (req, res) => {
    try {
        let roles = await Role.find({ isDeleted: false });
        res.send(roles);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// ⚠️ PHẢI đặt TRƯỚC GET /:id để Express không nhầm "users" là một :id
// GET /api/v1/roles/:id/users — lấy tất cả user thuộc role này
router.get('/:id/users', async (req, res) => {
    try {
        // Kiểm tra role có tồn tại không
        let role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ message: 'Role không tìm thấy' });
        }

        // Lấy tất cả user thuộc role này (chưa bị xoá mềm)
        let users = await User.find({
            role: req.params.id,
            isDeleted: false
        }).populate('role');

        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// GET role by id
router.get('/:id', async (req, res) => {
    try {
        let role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ message: 'Role không tìm thấy' });
        }
        res.send(role);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// POST create role
router.post('/', async (req, res) => {
    try {
        let newRole = new Role({
            name: req.body.name,
            description: req.body.description
        });
        let result = await newRole.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// PUT update role
router.put('/:id', async (req, res) => {
    try {
        let role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!role) {
            return res.status(404).send({ message: 'Role không tìm thấy' });
        }
        res.send(role);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// DELETE role — xoá mềm (isDeleted: true)
router.delete('/:id', async (req, res) => {
    try {
        let role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!role) {
            return res.status(404).send({ message: 'Role không tìm thấy hoặc đã bị xoá' });
        }
        res.send({ message: 'Xoá role thành công', role });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
