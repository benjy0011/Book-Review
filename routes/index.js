const { Router } = require("express");
const bookRouter = require("./bookRouter");
const ratingRouter = require("./ratingRouter");
const reviewRouter = require("./reviewRouter");

const router = Router();

router.use("/books", bookRouter);
router.use("/ratings", ratingRouter);
router.use("/reviews", reviewRouter);

module.exports = router;