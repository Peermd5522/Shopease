
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const Product = require("./models/Product.js");
const Order = require("./models/Order.js");

const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/auth", authRoutes);

// AI CHATBOT ROUTE
app.use("/chatbot", chatbotRoutes);


// =====================================
// TEST ROUTE
// =====================================

app.get("/test-ai", (req, res) => {
    res.json({
        message: "Correct ShopEase backend is running!"
    });
});


// =====================================
// GET ALL PRODUCTS
// =====================================

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// GET SINGLE PRODUCT
// =====================================

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// CREATE PRODUCT (ADMIN)
// =====================================

app.post(
    "/products",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const newProduct = await Product.create(req.body);

            res.status(201).json({
                message: "Product created successfully",
                product: newProduct
            });

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
);


// =====================================
// PLACE ORDER
// =====================================

app.post("/orders", async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);

        res.status(201).json({
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// =====================================
// UPDATE PRODUCT (ADMIN)
// =====================================

app.put(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.status(200).json({
                message: "Product updated successfully",
                product
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);


// =====================================
// DELETE PRODUCT (ADMIN)
// =====================================

app.delete(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.status(200).json({
                message: "Product Deleted Successfully",
                product
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);


// =====================================
// AI PRODUCT RECOMMENDATIONS
// =====================================

app.get("/products/:id/recommendations", async (req, res) => {
    try {
        const productId = req.params.id;

        // Check whether selected product exists
        const selectedProduct = await Product.findById(productId);

        if (!selectedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Get all products from MongoDB
        const products = await Product.find().lean();

        // Send products to Python AI service
        const aiResponse = await fetch(
            `${process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"}/recommend?
            product_id=${encodeURIComponent(productId)}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(products)
            }
        );

        if (!aiResponse.ok) {
            const errorDetails = await aiResponse.text();

            return res.status(502).json({
                message: "AI recommendation service failed",
                details: errorDetails
            });
        }

        // Get recommendations from Python
        const recommendations = await aiResponse.json();

        res.status(200).json(recommendations);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`ShopEase Backend Running on port ${PORT}...`);
});
