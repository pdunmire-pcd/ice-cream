// Import the express module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Define the port number where our server will listen
const PORT = 3005;

app.use(express.static('public'));

const orders = [];

// View engine will now recognize ejs files and render them when requested
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data from the request body
app.use(express.urlencoded({ extended: true }));

// Define a default "route" ('/')
app.get('/', (req, res) => {
    res.render('home');
});

// Confirmation route
app.get('/thank-you', (req, res) => {
    res.render('confirmation');
});

// Admin route
app.get('/admin', (req, res) => {
    res.render('admin', { orders });
});

app.post('/submit-order', (req, res) => {

    // Create an object to store the order data
    const order = {
        name: req.body.name,
        email: req.body.email,
        flavor: req.body.flavor,
        cone: req.body.method,
        toppings: req.body['topping'] ? [].concat(req.body['topping']).join(', ') : 'None',
        comment: req.body.comment,
        timestamp: new Date()
    };

    // Add order object to orders array
    orders.push(order);
    res.render('confirmation', { order });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});