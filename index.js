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

// server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})