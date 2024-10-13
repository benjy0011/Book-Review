const { Book, Review, Rating } = require("../models")

// Create a new book
const createNewBook = (bookData) => {
    return Book.create(bookData); // Create a new book in the database
};

// Read all books with optional filters
const findAllBooks = (filter) => {
    return Book.findAll({ where: {...filter} }); // Retrieve all books or apply filter
    // where:{(empty)} will find all books
};

// Read a specific book by ID, including its reviews and average rating
const findBookDetailsById = async (bookId) => {
    // Fetch the book by its ID, including its reviews and ratings
    const book = await Book.findByPk(bookId, {
        include: [
            {
                model: Review, // Include associated reviews
                attributes: ['review'], // Only include the rating score
            },
            {
                model: Rating, // Include associated ratings
                attributes: ['rating'], // Only include the rating score
            }
        ]
    });

    // If no book found, throw an error
    if (!book) {
        const error = new Error("Book not found.");
        error.statusCode = 404;
        throw error; // Throw the error to be handled by error middleware
    }

    // Calculate the average rating for the book
    const ratings = book.Ratings.map(r => r.rating); // Get ratings
    const averageRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length)
        : 0;

    // Return the book, reviews, and calculated average rating
    return {
        book,
        reviews: book.Reviews, // Return the list of reviews
        averageRating: (Math.round(averageRating*10)/10).toFixed(1), // Round to one decimal and prevent decimal error
    };
};

// Update a book by ID
const updateBookById = async (bookId, updatedData) => {
    const book = await Book.findByPk(bookId); // Find the book by ID
    if (book) {
        return book.update(updatedData); // Update book data
    }
    throw new Error("Book not found.");
};

// Delete a book by ID, including cascading deletion of associated ratings and reviews
const deleteBookById = (bookId) => {
    return Book.destroy({ where: { id: bookId } }); // Delete the book; ratings and reviews cascade-delete
};

module.exports = {
    createNewBook,
    findAllBooks,
    findBookDetailsById,
    updateBookById,
    deleteBookById,
};