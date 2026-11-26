const express = require("express");
const app = express();
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");
const Category = require("./models/category.models")
const Wishlist = require("./models/wishlist.models")
const Cart = require("./models/cart.models")
const Address = require("./models/address.models");
const Order = require("./models/order.models")

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
        const categories = await Category.find().select("name -_id");

        return categories.map((category) => category.name);

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

// Create multiple categories
async function createMultipleCategories(categories) {
    try {

        const savedCategories = await Category.insertMany(categories);
        return savedCategories;
        
    } catch (error) {
        throw error;
    }
}

// POST API to add multiple categories
app.post("/api/categories/bulk", async (req, res) => {
    try {

        const categories = await createMultipleCategories(req.body);

        res.status(201).json({
            message: "Categories added successfully.",
            data: {
                categories: categories
            }
        });
        
    } catch (error) {
        res.status(500).json({message: "Error adding category.",error: error.message})
    }
})

app.post("/api/wishlist", async (req, res) => {
    try {

        const { bookId } = req.body;

        const newWishlistItem = new Wishlist({
            bookId: bookId
        });

        const savedWishlistItem = await newWishlistItem.save();

        res.status(201).json({
            message: "Book added to wishlist successfully.", data: {
                Wishlist: savedWishlistItem
            }
        });
        
    } catch (error) {
        res.status(500).json({ message: "Error adding book to wishlist.", error: error.message})
    }
})


app.get("/api/wishlist", async (req, res) => {
    try {

        const wishlist = await Wishlist.find().populate("bookId");

        res.status(200).json({message: "Wishlist fetched successfully.", data: {
            wishlist: wishlist
        }
    });
        
    } catch (error) {
        res.status(500).json({message: "Error fetching wishlist.", error: error.message})
    }
})

app.put("/api/wishlist/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { bookId} = req.body;

        const updatedWishlistItem = await Wishlist.findByIdAndUpdate(id, {bookId: bookId}, {
            new: true
        });

        if(!updatedWishlistItem) {
            return res.status(404).json({message: "Wishlist item not found."})
        }

        res.status(200).json({
            message: "Wishlist item updated successfully.", data: 
            {
                wishlist: updatedWishlistItem
            }
        });
        
    } catch (error) {
        res.status(500).json({message: "Error updating wishlist item.", error: error.message})
    }
})

app.delete("/api/wishlist/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const deletedWishlistItem = await Wishlist.findByIdAndDelete(id);

        if(!deletedWishlistItem) {
            return res.status(404).json({message: "Wishlist item not found."});
        }

        res.status(200).json({
            message: "Wishlist item deleted successfully.",
            data: {
                wishlist: deletedWishlistItem
            }
        });
        
    } catch (error) {
        res.status(500).json({message: "Error deleting wishlist item.", error: error.message})
    }
})

app.post("/api/cart", async (req, res) => {
    try {

        const { bookId, quantity } = req.body;

        const newCartItem = new Cart({
            bookId: bookId,
            quantity: quantity,
        });

        const savedCartItem = await newCartItem.save();

        res.status(201).json({
            message: "Book added to cart successfully.", data: {
                cart: savedCartItem
            }
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error adding book to cart,", error: error.message
        });
    }
})

app.get("/api/cart", async (req, res) => {
    try {

        const cart = await Cart.find().populate("bookId");

        res.status(200).json({message: "Cart fetched successfully.", data: {
            cart: cart
        }})
        
    } catch (error) {
        res.status(500).json({message: "Error fetching cart.", error: error.message})
    }
})

app.put("/api/cart/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { quantity } = req.body;

        const updatedCartItem = await Cart.findByIdAndUpdate( id, { quantity: quantity}, {new: true, runValidators: true});

        if(!updatedCartItem) {
            res.status(404).json({
                message: "Cart item not found."
            })
        } else {
            res.status(200).json({message: "Cart item updated successfully.", data: {
                cart: updatedCartItem
            }
        });
        }
        
    } catch (error) {
        res.status(500).json({message: "Error updating cart item.", error: error.message})
    }
})

app.delete("/api/cart/:id", async(req, res) => {
    try {

        const { id } = req.params;
        const deletedCartItem = await Cart.findByIdAndDelete(id);

        if (!deletedCartItem) {
           return res.status(404).json({message: "Cart item not found."});
        }

        res.status(200).json({message: "Cart item deleted successfully.", data: {
            cart: deletedCartItem
        }
    });
        
    } catch (error) {
        res.status(500).json({message: "Error deleting cart item.", error: error.message})
    }
})

app.post("/api/addresses", async (req, res) => {
    try {

        const { fullAddress, city, pinCode } = req.body;

        const newAddress = new Address({
            fullAddress: fullAddress,
            city: city,
            pinCode: pinCode
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({message: "Address added successfully.", data: {
            address: savedAddress
        }})
        
    } catch (error) {
        res.status(500).json({message: "Error adding address.", error: error.message})
    }
})

app.get("/api/addresses", async (req, res) => {
    try {

        const addresses = await Address.find();

        res.status(200).json({message: "Addresses fetched successfully.", data: {
            addresses: addresses
        }})
        
    } catch (error) {
        res.status(500).json({message: "Error fetching addresses.", error: error.message})
    }
})

// PUT API to update an address
app.put("/api/addresses/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { fullAddress, city, pinCode } = req.body;

        const updatedAddress = await Address.findByIdAndUpdate(id, {
            fullAddress: fullAddress,
            city: city,
            pinCode: pinCode
        }, {
            new: true,
            runValidators: true
        }
    );

    if(!updatedAddress) {
        return res.status(404).json({message: "Address not Found."});
    }

    res.status(200).json({message: "Address updated successfully.", data: {
        address: updatedAddress
    }
});


        
    } catch (error) {
        res.status(500).json({message: "Error updating address.", error: error.message});
    }
})

app.delete("/api/addresses/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const deletedAddress = await Address.findByIdAndDelete(id);

        if(!deletedAddress) {
            return res.status(404).json({ message: "Address not found."});
        }

        res.status(200).json({message: "Address deleted successfully.", data: {
            address: deletedAddress
        }
    });
        
    } catch (error) {
        res.status(500).json({message: "Error deleting address...", error: error.message})
    }
})

app.post("/api/orders", async (req, res) => {
    try {

        const {
            customerInfo,
            deliveryAddress,
            books

        } = req.body;

        let totalPrice = 0;

        if (!books || books.length === 0) {
    return res.status(400).json({
        message: "At least one book is required to place an order."
    });
}

for (const item of books) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
            message: "Book quantity must be a positive integer."
        });
    }
}

        for (const item of books ) {
            const book = await Book.findById(item.bookId);

            if(!book) {
                return res.status(404).json({message: `Book not found: ${item.bookId}`});
            }

            totalPrice += book.price * item.quantity;
        }

        const newOrder = new Order({
            customerInfo,
            deliveryAddress,
            books,
            totalPrice
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({message: "Order placed successfully.", data: {
            order: savedOrder
        }
    });
        
    } catch (error) {

        if (error.name === "ValidationError") {
        return res.status(400).json({
            message: "Order validation failed.",
            error: error.message
        });
    }

        res.status(500).json({message: "Error placing order...", error: error.message})
    }
})

app.get("/api/orders", async (req, res) => {
    try {

        const orders = await Order.find().populate("books.bookId");

        res.status(200).json({message: "Orders fetched successfully.", data: {
            orders: orders
        }
    });
        
    } catch (error) {
        res.status(500).json({message: "Error fetching orders.", error: error.message})
    }
})

app.put("/api/orders/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const {
            customerInfo,
            deliveryAddress,
            books,
            totalPrice,
            status
        } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                customerInfo,
                deliveryAddress,
                books,
                totalPrice,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({message: "Order not found."});
        }

        res.status(200).json({message: "Order updated successfully.", data: {
            order: updatedOrder
        }
    });
        
    } catch (error) {
        res.status(500).json({message: "Error updating orders.", error: error.message})
    }
})

app.delete("/api/orders/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(id);

        if(!deletedOrder) {
           return res.status(404).json({message: "Order not found."});
        }

        res.status(200).json({message: "Order deleted successfully.", data: {
            order: deletedOrder
        }
    });
        
    } catch (error) {
        res.status(500).json({message: "Error deleting order.", error: error.message})
    }
})

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})