const { Sequelize } = require("sequelize");
const { bookModel } = require("./bookModel");
const { ratingModel } = require("./ratingModel");
const { reviewModel } = require("./reviewModel");
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Initialize the database
const db = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    dialect: "mysql",
});

// Create "books" table with the bookModel function and store inside a variable
const Book = bookModel(db);

// Create "ratings" table with the ratingModel function and store inside a variable
const Rating = ratingModel(db);

// Create "reviews" table with the reviewModel function and store inside a variable
const Review = reviewModel(db);

// Book -|-----<- Rating
Book.hasMany(Rating, { foreignKey: "bookId" });
Rating.belongsTo(Book, {foreignKey: "bookId" });

// Book -|-----<- Review
Book.hasMany(Review, { foreignKey: "bookId" });
Review.belongsTo(Book, { foreignKey: "bookId" });

// Sync the models with the database 
db.sync({ force: false }) // 'false' prevent recreate and force drop existing table
    .then(() => {
        console.log("Databse synced successfully.");
    })
    .catch((err) => {
        console.error("Failed to sync database:", err);
    })

// export "Book", "Rating", "Review" table db
module.exports = { db, Book, Rating, Review };