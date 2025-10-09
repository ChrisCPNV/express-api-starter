// routes/router.js
const express = require('express');
const pizzaRouter = require('../pizzas/pizzaRouter');

const router = express.Router();

router.use('/pizzas', pizzaRouter);

module.exports = router;
