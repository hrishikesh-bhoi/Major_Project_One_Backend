const mongoose = require("mongoose");
require("dotenv").config();


const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB successfully.")

        
    } catch (error) {
        console.log("Error connecting to MongoDB.", error)
    }
};

module.exports = { initializeDatabase };