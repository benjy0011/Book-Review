const express = require('express');
const path = require('path');
const router = require('./routes/index');
const dotenv = require('dotenv'); // Import dotenv
const { errorHandler } = require('./middlewares/errorHandler');

// Load environment variables from .env file
dotenv.config(); 

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser to parse req bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define routes using the router from the routes folder
app.use('/api', router);

// Route for the main page (books gallery)
app.get('/books', (req, res) => {
    res.render('books'); // Render the books.ejs template
});

// Route for the Add Book page
app.get('/books/add', (req, res) => {
    res.render('addBook'); // Render the addBook.ejs template
});

// Route for viewing book details
app.get('/books/:id', (req, res) => {
    res.render('bookDetails'); // Render the bookDetails.ejs template for a specific book
});

// Error handler
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});