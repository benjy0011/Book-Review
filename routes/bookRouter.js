const { Router } = require("express");
const { createBook, getAllBooks, getBookDetails, updateBook, deleteBook } = require("../controllers/bookController");

const router = Router();

router.route("/")
    .post(createBook)
    .get(getAllBooks);

router.route("/:id")
    .get(getBookDetails)
    .put(updateBook)
    .delete(deleteBook);

module.exports = router;