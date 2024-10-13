const asyncHandler = require('express-async-handler');
const { createNewRating, findAllRatingsByBookId } = require('../services/ratingService');
const { findBookDetailsById } = require('../services/bookService');

// Create a new rating for a specific book
const createRating = asyncHandler(async (req, res) => {
    // POST usually sends data in body of req
    // include bookId and rating in req.body
    // using consistent naming to destruct the data from req.body
    const { bookId, rating } = req.body;

    // Ensure book exists
    const book = await findBookDetailsById(bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    };

    // Create the rating
    const newRating = await createNewRating({ bookId, rating });

    // 201: resource created
    res.status(201).json({ message: "Rating added successfully", newRating });
});

// Fetch all ratings for a specific book
const getAllRatings = asyncHandler(async (req, res) => {
    const bookId = req.params.bookId;

    // Ensure book exists
    const book = await findBookDetailsById(bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    };

    // Retrieve all ratings for the specified book
    const ratings = await findAllRatingsByBookId(bookId);

    // If no ratings found for the book, return a 404 error
    // because a book has initial rating
    if (!ratings || ratings.length === 0) {
        return res.status(404).json({ message: "No ratings found for this book "});
    }

    // 200: Successful retrieval
    res.status(200).json(ratings);
});

module.exports = {
    createRating,
    getAllRatings,
}