// Import the express module
import express from 'express';
import mysql2 from 'mysql2'; 
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an instance of an Express application
const app = express();

// Define the port number where our server will listen
const PORT = 3005;

app.use(express.static('public'));

// View engine will now recognize ejs files and render them when requested
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data from the request body
app.use(express.urlencoded({ extended: true }));

// Create a database connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

app.get('/db-test', async (req, res) => {
    try {
        const [orders] = await pool.query("SELECT * FROM orders");
        res.send(orders);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).send("Database error: " + err.message);
    }
});

// Home route
app.get('/', (req, res) => {
    res.render('home');
});

// Confirmation route
app.get('/thank-you', (req, res) => {
    res.render('confirmation');
});

// Admin route
app.get('/admin', async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders ORDER BY timestamp DESC'
        );

        res.render('admin', { orders });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

// Submit order route
app.post('/submit-order', async (req, res) => {
    try {
        const order = {
            customer: req.body.name,
            email: req.body.email,
            flavor: req.body.flavor,
            cone: req.body.method,
            toppings: req.body.topping
                ? [].concat(req.body.topping).join(', ')
                : 'None',
            comment: req.body.comment
        };

        console.log('New order submitted:', order);

        const sql = `
            INSERT INTO orders (customer, email, flavor, cone, toppings)
            VALUES (?, ?, ?, ?, ?)
        `;

        const params = [
            order.customer,
            order.email,
            order.flavor,
            order.cone,
            order.toppings
        ];

        const [result] = await pool.execute(sql, params);
        console.log('Order saved with ID:', result.insertId);

        res.render('confirmation', { order });
    } catch (err) {
        console.error('Error saving order:', err);
        res.status(500).send('Sorry, there was an error processing your order.');
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});