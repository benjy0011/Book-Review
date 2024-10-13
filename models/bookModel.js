const { DataTypes, STRING, INTEGER } = require("sequelize")

const bookModel = (db) => {
    return db.define("Book", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        BookName: {
            type: STRING(45),
            allowNull: false,
        },
        Description: {
            type: STRING(12000),
            allowNull: false,
        },
        BookImage: {
            type: STRING(255), // Image link
            allowNull: false,
        },
        BookAuthor: {
            type: STRING(45),
            allowNull: false,
        },
    })
}

module.exports = { bookModel };