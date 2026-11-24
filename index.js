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

// Create a new book in the database
async function createBook(newBook) {
    try {

        const book = new Book(newBook);
        const savedBook = await book.save();
        return savedBook;
        
    } catch (error) {
        throw error;
    }
}

// POST API to create a new Book
app.post("/api/books", async (req, res) => {
    try {

        const newBook = await createBook(req.body);
        res.status(201).json({message: "Book added successfully.", data: {
            book: newBook
        }
    });
        
    } catch (error) {
        res.status(500).json({message: "Error adding Book.", error: error.message})
    }
});

// Create multiple books in the database
async function createMultipleBooks(books) {
    try {
        const savedBooks = await Book.insertMany(books);
        return savedBooks;
    } catch (error) {
        throw error;
    }
}

// POST API to create multiple books
app.post("/api/books/bulk", async (req, res) => {
    try {
        const books = await createMultipleBooks(req.body);

        res.status(201).json({
            message: "Books added successfully.",
            data: {
                books: books
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding books.",
            error: error.message
        });
    }
});

// Get a book by slug from the database
async function readBookBySlug(slug) {
    try {
        const book = await Book.findOne({ slug : slug });
        return book;
        
    } catch (error) {
        throw error;
    }
}

// Get API to fetch a book by slug
app.get("/api/books/slug/:slug", async (req, res) => {
    try {

        const book = await readBookBySlug(req.params.slug);

        if(book) {
            res.status(200).json({message: "Book fetched successfully.", data: {
                book : book
            }});
        } else {
            res.status(404).json({message: "Book not found."});
        }
        
    } catch (error) {
        res.status(500).json({ message: "Error fetching book.", error: error.message})
    }
});

// Update book description
async function updateBookDescription(slug, description) {
    try {
        const updatedBook = await Book.findOneAndUpdate(
            { slug: slug },
            { description: description },
            { new: true }
        );

        return updatedBook;
    } catch (error) {
        throw error;
    }
}

// PATCH API to update book description
app.patch("/api/books/slug/:slug/description", async (req, res) => {
    try {
        const updatedBook = await updateBookDescription(
            req.params.slug,
            req.body.description
        );

        if (updatedBook) {
            res.status(200).json({
                message: "Book description updated successfully.",
                data: { book: updatedBook }
            });
        } else {
            res.status(404).json({
                message: "Book not found."
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error updating book description.",
            error: error.message
        });
    }
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})