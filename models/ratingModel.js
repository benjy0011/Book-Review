const { DataTypes, INTEGER } = require("sequelize")

const ratingModel = (db) => {
    return db.define("Rating", {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        bookId: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: "books",  // Book model table name
                key: "id",       // PK in Book
            },
            onDelete: 'CASCADE',    // Deleted the rating when the associated book is deleted
        },
        rating: {
            type: INTEGER,
            allowNull: false,
        },
    })
}

module.exports = { ratingModel };