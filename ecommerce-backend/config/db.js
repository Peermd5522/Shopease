const mongoose = require("mongoose");

async function connectDB() {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");

        console.log("MongoDb Connected");
    } catch (error) {

        console.log("Database Connection Failed");
        console.log(error);
    }
}

module.exports = connectDB;