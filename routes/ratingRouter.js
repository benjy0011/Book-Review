const { Router } = require("express");
const { createRating, getAllRatings } = require("../controllers/ratingController");

const router = Router();

router.post("/", createRating)
router.get("/book/:bookId", getAllRatings)

module.exports = router;