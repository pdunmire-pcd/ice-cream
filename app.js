// Import the express module
import express from 'express';

// Create an instance of an Express application
const app = express();

// Define the port number where our server will listen
const PORT = 3000;

app.use(express.static('public'));

const orders = [];

//view engine will noe recognize ejs files and render them when requested
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data from the request body
app.use(express.urlencoded({ extended: true }));

// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client 
app.get('/', (req, res) => {
    res.render('home');
});


app.post('/submit-order', (req, res) => {
    
    // Create a JSON object to store the order data
    const orders = {
        name: req.body.name,
        email: req.body.email,
        orderDetails: req.body.order-details,
        toppings: req.body.topping ? req.body.topping : "none",
        coneLegend: req.body.cone-legend,
        flavor: req.body.flavor,
        timestamp: new Date()
    };

    // Add order object to orders array
    orders.push(orders);
    res.render('confirmation', { orders });

});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

