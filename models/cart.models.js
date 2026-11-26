const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        requird: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
}, {
    timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;