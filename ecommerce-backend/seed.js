const mongoose = require("mongoose");
const Product = require("./models/Product");
const connectDB = require("./config/db");

const seedProducts = async () => {
    try {
        await connectDB();

        const response = await fetch("https://dummyjson.com/products?limit=0");
        const data = await response.json();

        console.log(`Fetched ${data.products.length} products`);

        const products = data.products.map((product) => ({
            name: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            rating: product.rating,
            stock: product.stock,
            brand: product.brand,
            image: product.thumbnail
        }));

        console.log(products[0]);

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("Products inserted successfully");

    } catch (error) {
        console.error("Error:", error.message);
    }
};

seedProducts();