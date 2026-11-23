
const mongoose = require("mongoose");

async function connectDB() {
    try {
        const mongoURI = process.env.MONGO_URI;

        console.log("MONGO_URI exists:", Boolean(mongoURI));
        console.log("MONGO_URI protocol:", mongoURI?.split(":")[0] || "MISSING");

        if (!mongoURI) {
            throw new Error("MONGO_URI environment variable is missing");
        }

        await mongoose.connect(mongoURI);

        console.log("MongoDB Atlas Connected");

    } catch (error) {
        console.log("Database Connection Failed");
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
