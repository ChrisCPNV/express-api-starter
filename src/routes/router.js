// routes/router.js
const express = require('express');
const pizzasRouter = require('../pizzas/pizzasRouter');

const router = express.Router();

router.use('/pizzas', pizzasRouter);

module.exports = router;
