const { Rating } = require("../models");

// Create a new rating for a book
const createNewRating = (ratingData) => {
    return Rating.create(ratingData); // Insert a new rating for the specified book
};

// Read all ratings for a specific book by its ID
const findAllRatingsByBookId = (bookId) => {
    return Rating.findAll({ where: { bookId } }); // Retrieve all ratings for a particular book
}

module.exports = {
    createNewRating,
    findAllRatingsByBookId,
};