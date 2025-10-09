// routes/pizzasRouter.js
const express = require('express');
const { body, param } = require('express-validator');
const pizzaController = require('./pizzaController');

const router = express.Router();

/**
 * @openapi
 * /api/pizzas:
 *   get:
 *     summary: Retrieve a list of pizzas
 *     responses:
 *       200:
 *         description: A list of pizzas
 *   post:
 *     summary: Create a new pizza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pizza created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/pizzas/{id}:
 *   get:
 *     summary: Get a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single pizza
 *       404:
 *         description: Pizza not found
 *   put:
 *     summary: Update a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pizza not found
 *   delete:
 *     summary: Delete a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pizza deleted
 *       404:
 *         description: Pizza not found
 */

/**
 * @openapi
 * /api/pizzas/{id}/compositions:
 *  get:
 *    summary: Get pizza compositions by ID
 *    tags: [Compositions]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Pizza ID
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      200:
 *        description: A list of pizza compositions
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PizzaComposition'
 *      404:
 *        description: Pizza not found
 * 
 *  post:
 *    summary: Add a composition to a pizza
 *    tags: [Compositions]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the pizza to add the composition to
 *        schema:
 *          type: integer
 *          example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ingredient_id:
 *                type: integer
 *                description: ID of the ingredient to add
 *                example: 1
 *    responses:
 *     201:
 *       description: Composition added
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/PizzaComposition'
 *      400:
 *         description: Validation error or missing data
 *      404:
 *         description: Pizza or ingredient not found
 * 
 *     delete:
 *       summary: Delete all compositions from a pizza
 *       tags: [Compositions]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the pizza whose compositions to delete
 *           schema:
 *             type: integer
 *             example: 1
 *       responses:
 *         204:
 *           description: All compositions deleted
 *         404:
 *           description: Pizza or ingredient not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('description').optional().isString(),
    body('imageUrl').optional().isString().isURL().withMessage('imageUrl must be a valid URL'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

const createAndUpdateValidationsComposition = [
    body('pizza_id').isString().notEmpty().withMessage('pizza_id must be a non-empty string'),
    body('ingredient_id').isString().notEmpty().withMessage('ingredient_id must be a non-empty string'),
];

// Pizza routes
router.get('/', pizzaController.findAll);
router.post('/', createAndUpdateValidations, pizzaController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], pizzaController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.delete);

// Pizza compositions routes
router.get('/:id/compositions', [param('id').isInt()], pizzaController.getCompositions);
router.post('/:id/compositions',  createAndUpdateValidationsComposition, pizzaController.addComposition);
router.delete('/:id/compositions', [param('id').isInt()], pizzaController.deleteCompositions);

module.exports = router;
