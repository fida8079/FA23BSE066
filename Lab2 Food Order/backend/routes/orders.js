const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Middleware to simulate stateless authentication. 
// In a real app, this verifies a token passed in the Authorization header.
const authenticate = (req, res, next) => {
    // e.g., req.user = verifyToken(req.headers.authorization);
    req.user = { id: 'sample_customer_id' };
    next();
};

/**
 * [GET] /orders
 * Purpose: Retrieve a list of orders (potentially filtered).
 * REST Principle: GET is safe and idempotent. Calling this multiple times 
 * does not change the state of the server.
 */
router.get('/', authenticate, async (req, res) => {
    try {
        // Statelessness: We use the user info embedded in the request token, not a session.
        const orders = await Order.find({ customerId: req.user.id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

/**
 * [GET] /orders/:id
 * Purpose: Retrieve a specific order by its unique identifier.
 * REST Principle: GET is safe and idempotent.
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
});

/**
 * [POST] /orders
 * Purpose: Create a new order.
 * REST Principle: POST is NOT idempotent. Executing this request multiple times 
 * will result in multiple new distinct orders being created. It is used to generate 
 * a new subordinate resource.
 */
router.post('/', authenticate, async (req, res) => {
    try {
        const { restaurantId, items, totalAmount } = req.body;

        const newOrder = new Order({
            customerId: req.user.id, // Derived from stateless token
            restaurantId,
            items,
            totalAmount
        });

        const savedOrder = await newOrder.save();
        // 201 Created is the standard REST response for successful POST creation
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ error: 'Invalid order data provided' });
    }
});

/**
 * [PUT] /orders/:id
 * Purpose: Completely replace/update an existing order (often used here to update status).
 * REST Principle: PUT is idempotent. If you send { status: 'cancelled' } ten times,
 * the resulting state on the server is exactly the same as if you sent it once.
 * (Note: PATCH could be used for partial updates, but PUT replaces the targeted resource state).
 */
router.put('/:id', authenticate, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body, // In strict REST, PUT implies sending the whole replaced object
            { new: true, runValidators: true }
        );

        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order' });
    }
});

/**
 * [DELETE] /orders/:id
 * Purpose: Remove an order.
 * REST Principle: DELETE is idempotent. Deleting an order that exists will remove it (200 OK). 
 * Attempting to delete it again will just return 404 Not Found, but the end state of the server 
 * (the order is gone) remains the same regardless of how many times you call it.
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });

        // 204 No Content is often used if no body is returned, but 200 with a message is fine too.
        res.status(200).json({ message: 'Order successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

module.exports = router;
