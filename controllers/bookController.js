const asyncHandler = require('express-async-handler');
const { createNewBook, findBookDetailsById, findAllBooks, updateBookById, deleteBookById } = require('../services/bookService');
const { createNewReview } = require('../services/reviewService');
const { createNewRating, findAllRatingsByBookId } = require('../services/ratingService');

// Create a new book with an initial review and rating
const createBook = asyncHandler(async (req, res) => {
    // Fetch the required info from req
    const { BookName, BookAuthor, Description, BookImage, review, rating } = req.body;

    console.log('BookName: ', BookName);
    console.log('BookAuthor: ', BookAuthor);
    console.log('Description: ', Description);
    console.log('BookImage: ', BookImage);
    console.log(`Review: ${review ? review : "no review"}`);
    console.log(`Rating: ${rating}`);

    // Backend check to ensure that the data exists
    if (!BookName || !BookAuthor || !BookImage || !Description || !rating) {
        res.status(400).json({ message: 'All fields are required.' }); // Simple error response
        return;
    }

    // Create the book
    const newBook = await createNewBook({ 
        BookName: BookName.trim(), 
        BookAuthor: BookAuthor.trim(), 
        Description: Description.trim(), 
        BookImage: BookImage.trim(), 
    });

    // Create the initial review for the book (if exist)
    let newReview = null;
    if (review && review.trim()) {
        newReview = await createNewReview({ bookId: newBook.id, review: review.trim() });
    }
    
    // Create the initial rating for the book
    const newRating = await createNewRating({ bookId: newBook.id, rating });

    // 201: Request Success
    res.status(201).json({ 
        message: "New book added successfully!", 
        newBook, 
        newReview: newReview || 'No review provided', 
        newRating 
    });
});

// Fetch all books with optional search filters
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await findAllBooks();  // Filters as query parameters (can be empty)

    const { filterBy= 'title', order= 'asc' } = req.query;

    // Calculate average rating for each book
    const booksWithAverageRating = await Promise.all(books.map(async (book) => {
        const ratings = await findAllRatingsByBookId(book.id);
        const ratingsValues = ratings.map(r => r.rating);

        const averageRating = ratingsValues.length > 0
            ? (ratingsValues.reduce((sum,r) => sum + r, 0) / ratingsValues.length).toFixed(1)
            : null;

        return {
            ...book.dataValues,
            averageRating
        };
    }));

    // Custom sort
    let sortedBooks = [...booksWithAverageRating];
    if (filterBy === 'title') {
        sortedBooks = sortedBooks.sort((a, b) => order === 'asc'
            ? a.BookName.localeCompare(b.BookName)
            : b.BookName.localeCompare(a.BookName));
    } else if (filterBy === 'author') {
        sortedBooks = sortedBooks.sort((a, b) => order === 'asc'
            ? a.BookAuthor.localeCompare(b.BookAuthor)
            : b.BookAuthor.localeCompare(a.BookAuthor));
    } else if (filterBy === 'rating') {
        sortedBooks = sortedBooks.sort((a, b) => order === 'asc'
            ? (a.averageRating || 0) - (b.averageRating || 0) // Sort by average rating
            : (b.averageRating || 0) - (a.averageRating || 0));
    }

    res.status(200).json(sortedBooks);
});

// Fetch a specific book's details (with reviews and ratings)
const getBookDetails = asyncHandler(async (req,res) => {
    const bookId = req.params.id;
    const bookDetails = await findBookDetailsById(bookId);

    // If the book is not found, return a 404 error
    if (!bookDetails) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    // 200 - Successful retrieval
    res.status(200).json({
        book: bookDetails.book,
        reviews: bookDetails.reviews || [], // Return an empty array if no ratings yet
        averageRating: bookDetails.averageRating || 0, 
    }); 
});

// Update a book by ID (may not be implemented)
const updateBook = asyncHandler(async (req, res) => {
    // use params to identify source
    const bookId = req.params.id;
    const updatedData = req.body;
    const updatedBook = await updateBookById(bookId, updatedData);

    // If the book is not found, return 404 error
    if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
    }

    // 200: Successful request
    res.status(200).json({ message: "Book updated successfully", updatedBook });
});

// Delete a book by ID
const deleteBook = asyncHandler(async (req, res) => {
    const bookId = req.params.id;
    const book = await deleteBookById(bookId);

    // If the book is not found. return a 404 error
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Return status 204 - No Content (successful deletion, no response body needed)
    res.status(204).json({ message: "Book, along with associated reviews and ratings, deleted successfully", book })
});

module.exports = {
    createBook,
    getAllBooks,
    getBookDetails,
    updateBook,
    deleteBook,
};