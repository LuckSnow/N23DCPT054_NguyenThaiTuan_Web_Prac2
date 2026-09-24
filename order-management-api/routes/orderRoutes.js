const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. Lay toan bo don hang (GET /api/orders)
// Ho tro loc theo status (Yeu cau 1) va sap xep theo tong tien (Yeu cau 3)
router.get('/', async (req, res) => {
    try {
        const { status, sort } = req.query;
        let query = {};
        if (status) {
            query.status = status;
        }

        let sortOption = { createdAt: -1 };
        if (sort) {
            sortOption = { totalAmount: sort.toLowerCase() === 'asc' ? 1 : -1 };
        }

        const orders = await Order.find(query).sort(sortOption);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Yeu cau 2: Tim kiem theo ten khach hang (GET /api/orders/search?name=...)
// Dat truoc route /:id de tranh xung dot route param
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        const orders = await Order.find({
            customerName: { $regex: name || '', $options: 'i' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Lay don hang theo ID (GET /api/orders/:id)
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Khong tim thay don hang' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Tao don hang moi (POST /api/orders)
router.post('/', async (req, res) => {
    const order = new Order({
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        items: req.body.items,
        totalAmount: req.body.totalAmount
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. Cap nhat trang thai don hang (PUT /api/orders/:id)
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Khong tim thay don hang' });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. Xoa don hang (DELETE /api/orders/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Khong tim thay don hang' });
        res.json({ message: 'Da xoa don hang thanh cong!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
