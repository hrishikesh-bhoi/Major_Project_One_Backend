const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    fullAddress: {
        type: String,
        required: true,
        trim: true,
    },

    city: {
        type: String,
        required: true,
        trim: true
    },
    pinCode: {
        type: String,
        required: true,
        match: /^\d{6}$/
    }
}, {
    timestamps: true
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;