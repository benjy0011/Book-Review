const asyncHandler = require('express-async-handler');
const { createNewReview, findAllReviewsByBookId } = require('../services/reviewService');
const { findBookDetailsById } = require('../services/bookService');

// Create a new review for a specific book
const createReview = asyncHandler(async (req, res) => {
    // POST use req.body to send data
    const { bookId, review } = req.body; 

    // Ensure book exists
    const book = await findBookDetailsById(bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    };

    // Create the review
    const newReview = await createNewReview( {bookId, review });

    // 201: resource created
    res.status(201).json({ message: "Review added successfully", newReview });
});

// Fetch all the reviews for a specific book
const getAllReviews = asyncHandler(async (req, res) => {
    // GET use req.params
    const bookId = req.params.bookId;

    // Ensure book exists
    const book = await findBookDetailsById(bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    };

    // Retrieve all reviews for the specific book
    const reviews = await findAllReviewsByBookId(bookId);

    // If no reviews are found, return empty array
    res.status(200).json({
        reviews: reviews || [], // If no reviews, return an empty array
    });
});

module.exports = {
    createReview,
    getAllReviews
};