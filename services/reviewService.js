const { Review } = require("../models")

// Create a new service for a book
const createNewReview = (reviewData) => {
    return Review.create(reviewData); // Insert a new review for the specified book
};

// Read all reviews for a specific book by its ID
const findAllReviewsByBookId = (bookId) => {
    return Review.findAll({ where: { bookId } }); // Retrieve all reviews for a particular book
}

module.exports = {
    createNewReview,
    findAllReviewsByBookId,
};