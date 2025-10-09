// controllers/pizzasController.js
const { validationResult } = require('express-validator');
const Pizzas = require('./pizza');

/**
 * Controller functions use Express (req, res) signatures and
 * respond with status codes matching MDN/HTTP recommendations.
 */

// POST /api/pizzas
exports.create = async (req, res, next) => {
    try {
        // validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // 400 Bad Request for validation problems
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, ingredients, imageUrl, price } = req.body;
        const created = await Pizzas.create({ name, ingredients, imageUrl, price });
        // 201 Created
        return res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

// GET /api/pizzas/
exports.findAll = async (req, res, next) => {
    try {
        const pizzas = await Pizzas.findAll();
        // 200 OK
        return res.status(200).json(pizzas);
    } catch (err) {
        next(err);
    }
};

// GET /api/pizzas/:id
exports.findOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const pizza = await Pizzas.findById(id);
        if (!pizza) return res.status(404).json({ error: 'Pizzas not found' }); // 404 Not Found

        return res.status(200).json(pizza);
    } catch (err) {
        next(err);
    }
};

// PUT /api/pizzas/:id
exports.update = async (req, res, next) => {
    try {
        // validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const { name, ingredients, imageUrl, price } = req.body;
        const updated = await Pizzas.update(id, { name, ingredients, imageUrl, price });
        if (!updated) return res.status(404).json({ error: 'Pizzas not found' }); // 404 Not Found

        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/pizzas/:id
exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const deleted = await Pizzas.delete(id);
        if (deleted === 0) return res.status(404).json({ error: 'Pizzas not found' });

        // 204 No Content on successful delete
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// GET /api/pizzas/:id/full
exports.getPizzaWithIngredients = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const pizza = await Pizzas.getPizzaWithIngredients(id);
        res.json(pizza);
    } catch (err) {
        next(err);
    }
};

// POST /api/pizzas/:id/compositions
exports.addComposition = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { ingredient_id, quantity, unit } = req.body;
        const composition = await Pizzas.addComposition(id, { ingredient_id, quantity, unit });
        res.status(201).json(composition);
    } catch (err) {
        next(err);
    }
};

// GET /api/pizzas/:id/compositions
exports.getCompositions = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const compositions = await Pizzas.getCompositions(id);
        res.json(compositions);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/pizzas/:id/compositions
exports.deleteCompositions = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const deleted = await Pizzas.deleteCompositions(id);
        if (!deleted) return res.status(404).json({ error: 'Pizza or compositions not found' });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};