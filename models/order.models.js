const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/
        }
    },

    deliveryAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        pinCode: {
            type: String,
            required: true
        }
    },

    books: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        default: "Placed"
    }
    
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;