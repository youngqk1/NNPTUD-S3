const express = require('express')
let router = express.Router()
let slugify = require('slugify')
let Product = require('../schemas/products')

// GET all products
router.get('/', async (req, res) => {
    try {
        let result = await Product.find({ isDeleted: false }).populate('category');
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// GET one product
router.get('/:id', async (req, res) => {
    try {
        let result = await Product.findOne({ _id: req.params.id, isDeleted: false }).populate('category');
        if (result) {
            res.send(result)
        } else {
            res.status(404).send("Product not found")
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// POST create product
router.post('/', async (req, res) => {
    try {
        let newProduct = new Product({
            title: req.body.title,
            slug: slugify(req.body.title, {
                replacement: '-',
                lower: true,
                remove: undefined,
            }),
            price: req.body.price,
            description: req.body.description,
            category: req.body.category, // Assuming ObjectId
            images: req.body.images
        })
        let result = await newProduct.save();
        res.status(201).send(result)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// PUT update product
router.put('/:id', async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.body.title) {
            updateData.slug = slugify(req.body.title, {
                replacement: '-',
                lower: true
            });
        }

        let result = await Product.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            updateData,
            { new: true }
        );

        if (result) {
            res.status(200).send(result)
        } else {
            res.status(404).send("Product not found or already deleted")
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// DELETE product (Soft delete)
router.delete('/:id', async (req, res) => {
    try {
        let result = await Product.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (result) {
            res.status(200).send({ message: "Product deleted", result })
        } else {
            res.status(404).send("Product not found or already deleted")
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router;
