// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'dev.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pizzas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, 
            imageUrl TEXT,
            price REAL NOT NULL,
            ingredients TEXT,
            created_at TEXT DEFAULT ( datetime ( 'now' )),
            updated_at TEXT DEFAULT ( datetime ( 'now' ))
            )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS pizzaIngredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pizza_id INTEGER NOT NULL,
            ingredient_id INTEGER NOT NULL,
            created_at TEXT DEFAULT ( datetime ( 'now' )),
            updated_at TEXT DEFAULT ( datetime ( 'now' )),
            FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE
            )    
        `);

    db.get(`SELECT COUNT(*) as count FROM pizzas`, (err, row) => {
        if (err) {
            console.error('Error counting pizzas:', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding test data (pizzas)...');

            const pizzaData = [
                ['Margherita', 'https://example.com/margherita.jpg', 'Tomato, Mozzarella, Basil', 8.99],
                ['Pepperoni', 'https://example.com/pepperoni.jpg', 'Tomato, Mozzarella, Pepperoni', 9.99],
            ];

            const insertPizzaSql = `INSERT INTO pizzas (name, imageUrl, ingredients, price) VALUES (?, ?, ?, ?)`;
            const pizzaStmt = db.prepare(insertPizzaSql);

            pizzaData.forEach(([name, imageUrl, ingredients, price]) => 
                pizzaStmt.run(name, imageUrl, ingredients, price)
            );

            pizzaStmt.finalize(() => console.log('Seed data inserted.'));
        } else {
            console.log('Database already has data, skipping seeding.');
        }
    });
});

module.exports = db;
