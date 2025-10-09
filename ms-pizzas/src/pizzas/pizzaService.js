const Pizza = require('./pizza');
const fetch = require('node-fetch');
const { getPizzaWithIngredients } = require('./pizzaController');
const { get } = require('../routes/router');

const PIZZA_INGREDIENTS_SERVICE_URL = process.env.PIZZA_INGREDIENTS_SERVICE_URL || 'http://localhost:3000';

const PizzaService = {
    async getAll() {
        return Pizza.findAll();
    },

    async getById(id) {
        return Pizza.findById(id);
    },

    async create(pizza) {
        return Pizza.create(pizza);
    },

    async update(id, pizza) {
        const existing = await Pizza.findById(id);
        if (!existing) return null;

        return Pizza.update(id, pizza);
    },

    async delete(id) {
        const existing = await Pizza.findById(id);
        if (!existing) return null;

        return Pizza.delete(id);
    },

    async getPizzaWithIngredients(id) {
        const pizza = await Pizza.findById(id);
        if (!pizza) throw new Error('Pizza not found');

        const composition = await Pizza.findCompositions(id);

        const ingredients = await Promise.all(
            composition.map(async (comp) => {
                const res = await fetch(`${PIZZA_INGREDIENTS_SERVICE_URL}/api/ingredients/${comp.ingredient_id}`);
                if (!res.ok) throw new Error(`Failed to fetch ingredient with id ${comp.ingredient_id}`);
                const ingredientData = await res.json();
                return { ...ingredientData, quantity: comp.quantity, unit: comp.unit };
            })
        );

        return { ...pizza, ingredients };
    },

    async addComposition(pizzaId, ingredient_id) {
        const response = await fetch(`${PIZZA_INGREDIENTS_SERVICE_URL}/api/ingredients/${ingredient_id}`);
        if (!response.ok) throw new Error('Ingredient not found');

        return Pizza.insertComposition(pizzaId, ingredient_id);
    },

    async getCompositions(pizzaId) {
        return Pizza.findCompositions(pizzaId);
    },

    async deleteCompositions(pizzaId) {
        const existing = await Pizza.findCompositions(pizzaId);
        if (!existing) return null;

        return Pizza.deleteCompositions(pizzaId);
    }

};

module.exports = PizzaService;
