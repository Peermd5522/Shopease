require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Product = require("./models/Product.js");
const Order = require("./models/Order.js")
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");


const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);



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


app.post("/products", 
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

});

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



app.put("/products/:id", 
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

});


app.delete("/products/:id", 
           authMiddleware,
           adminMiddleware,
           async(req,res) => {

    try {

       const product = await Product.findByIdAndDelete(req.params.id);

       if(!product) {
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
});




app.listen(3000, () => {
        console.log("Server Running...");
});