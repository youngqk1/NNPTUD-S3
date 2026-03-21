const express = require('express')
let router = express.Router()
let inventorySchema = require('../schemas/inventories')

// 1. Get all inventories (joined with product)
router.get('/', async (req, res) => {
    try {
        let result = await inventorySchema.find().populate('product')
        res.send(result)
    } catch (error) {
        res.status(500).send({ message: "COULD NOT GET INVENTORIES", error: error.message })
    }
})

// 2. Get inventory by ID (joined with product)
router.get('/:id', async (req, res) => {
    try {
        let result = await inventorySchema.findById(req.params.id).populate('product')
        if (result) {
            res.send(result)
        } else {
            res.status(404).send({ message: "ID NOT FOUND" })
        }
    } catch (error) {
        res.status(500).send({ message: "SOMETHING WENT WRONG", error: error.message })
    }
})

// 3. Add_stock ({product, quantity}) - Increase stock corresponding to quantity
router.post('/add-stock', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        // Search by product ID or inventory ID? Assuming product ID as per requirement {product, quantity}
        let result = await inventorySchema.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } },
            { new: true, upsert: false } // We assume inventory already exists since it's created with product
        ).populate('product')

        if (result) {
            res.send(result)
        } else {
            res.status(404).send({ message: "PRODUCT INVENTORY NOT FOUND" })
        }
    } catch (error) {
        res.status(400).send({ message: "COULD NOT ADD STOCK", error: error.message })
    }
})

// 4. Remove_stock ({product, quantity}) - Decrease stock corresponding to quantity
router.post('/remove-stock', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        let result = await inventorySchema.findOneAndUpdate(
            { product: product, stock: { $gte: quantity } }, // ensure enough stock
            { $inc: { stock: -quantity } },
            { new: true }
        ).populate('product')

        if (result) {
            res.send(result)
        } else {
            res.status(400).send({ message: "NOT ENOUGH STOCK OR PRODUCT NOT FOUND" })
        }
    } catch (error) {
        res.status(400).send({ message: "COULD NOT REMOVE STOCK", error: error.message })
    }
})

// 5. Reservation ({product, quantity}) - Decrease stock and increase reserved corresponding to quantity
router.post('/reservation', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        let result = await inventorySchema.findOneAndUpdate(
            { product: product, stock: { $gte: quantity } },
            { $inc: { stock: -quantity, reserved: quantity } },
            { new: true }
        ).populate('product')

        if (result) {
            res.send(result)
        } else {
            res.status(400).send({ message: "NOT ENOUGH STOCK OR PRODUCT NOT FOUND" })
        }
    } catch (error) {
        res.status(400).send({ message: "COULD NOT RESERVE", error: error.message })
    }
})

// 6. Sold ({product, quantity}) - Decrease reservation and increase soldCount corresponding to quantity
router.post('/sold', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        let result = await inventorySchema.findOneAndUpdate(
            { product: product, reserved: { $gte: quantity } },
            { $inc: { reserved: -quantity, soldCount: quantity } },
            { new: true }
        ).populate('product')

        if (result) {
            res.send(result)
        } else {
            res.status(400).send({ message: "NOT ENOUGH RESERVED STOCK OR PRODUCT NOT FOUND" })
        }
    } catch (error) {
        res.status(400).send({ message: "COULD NOT SELL", error: error.message })
    }
})

module.exports = router;
