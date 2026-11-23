const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    
    title: {
        type: String,
        required: true,
    },

    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    description: {
        type: String
    }

});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;