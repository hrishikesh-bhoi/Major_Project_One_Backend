const express = require("express");
const app = express();
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");

app.use(cors())



// Middleware
app.use(express.json());

// test routes
app.get("/", (req, res) => {
    res.send("Book Store App is running...!")
});

//connect to mongodb
initializeDatabase();

// Get all books from the database
async function readAllBooks() {
    try {
        const allBooks = await Book.find();
        return allBooks;
        
    } catch (error) {
        throw error;
    }
}

// Get api to fetch all books
app.get("/api/books", async (req, res) => {
    try {
        const books = await readAllBooks();

        if(books.length !== 0) {

            res.status(200).json({message: "Books fetched successfully.", data: {books: books} })
        } else {
            res.status(404).json({message: "No Books found."})
        }
        
    } catch (error) {
        res.status(500).json({message: "Error fetching books", error: error.message})
    }
})

// Get a book by ID from the database
async function readBookById(bookId) {
    try {
        const book = await Book.findById(bookId);
        return book;
        
    } catch (error) {
        throw error;
    }
}

// Get api to fetch a book by ID
app.get("/api/books/:bookId", async (req, res) => {
    try {
        const book = await readBookById(req.params.bookId)

        if(book) {
            res.status(200).json({message: "Book fetched successfully.", data: {
                book: book
            }});
        } else {
            res.status(404).json({message:"Book not found."})
        }
        
    } catch (error) {
        res.status(500).json({message: "Error fetching book.", error: error.message})
    }
});

// Get all category from database
async function readAllCategories() {
    try {
        const categories = await Book.distinct("category");
        return categories;
    } catch (error) {
        throw error;
    }
}

// Get books by category
async function readBooksByCategory(categoryId) {
    try {
        const books = await Book.find({ category: categoryId });
        return books;
    } catch (error) {
        throw error;
    }
}

// GET API to fetch books by category
app.get("/api/categories/:categoryId", async (req, res) => {
    try {
        const books = await readBooksByCategory(req.params.categoryId);

        if (books.length !== 0) {
            res.status(200).json({
                message: "Books fetched successfully by category.",
                data: { books: books }
            });
        } else {
            res.status(404).json({
                message: "No books found in this category."
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books by category.",
            error: error.message
        });
    }
});

// Get api to fetch all categories
app.get("/api/categories", async(req, res) => {
    try {
        const categories = await readAllCategories();

        if(categories.length !== 0) {
            res.status(200).json({message: "Categories fetched successfully.", data: {
                categories: categories
            }});
        } else {
            res.status(404).json({message: "No Categories found."})
        }
        
    } catch (error) {
        res.status(500).json({message: "Error fecthing categories.", error: error.message})
    }
})

// server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})