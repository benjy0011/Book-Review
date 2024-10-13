const { DataTypes, INTEGER, STRING, Model } = require("sequelize")

const reviewModel = (db) => {
    return db.define("review", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        bookId: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'books', // Match the Book model table name
                key: "id",
            },
            onDelete: "CASCADE",
        },
        review: {
            type: STRING(12000),
            allowNull: false,
        },
    })
};

module.exports = { reviewModel };