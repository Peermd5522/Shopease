
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Words that don't describe a product
const stopWords = [
    "show", "find", "want", "need",
    "suggest", "recommend", "looking",
    "for", "with", "some", "please",
    "product", "products", "give", "me",
    "under", "below", "less", "than",
    "maximum", "max", "within",
    "price", "budget", "around",
    "best", "the", "a", "an",
    "and", "or", "i", "to"
];

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                message: "Please enter a message."
            });
        }

        const text = message.toLowerCase();

        // Extract budget
        const budgetMatch = text.match(
            /(?:under|below|less than|max|maximum|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i
        );

        const budget = budgetMatch
            ? Number(budgetMatch[1])
            : null;

        // Detect category
        const categories = await Product.distinct("category");

        const matchedCategory = categories.find(category =>
            text.includes(category.toLowerCase())
        );

        // Detect brand
        const brands = await Product.distinct("brand");

        const matchedBrand = brands.find(brand =>
            brand && text.includes(brand.toLowerCase())
        );

        // Extract product keywords
        const keywords = text
            .replace(/[^\w\s]/g, " ")
            .split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !stopWords.includes(word))
            .filter(word => !/^\d+$/.test(word));

        // Build query
        const query = {
            stock: { $gt: 0 }
        };

        if (budget !== null) {
            query.price = { $lte: budget };
        }

        if (matchedCategory) {
            query.category = matchedCategory;
        }

        if (matchedBrand) {
            query.brand = matchedBrand;
        }

        // Search by product keywords
        if (keywords.length > 0) {
            const keywordRegex = keywords.map(
                word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            );

            query.$or = [
                { name: { $regex: keywordRegex.join("|"), $options: "i" } },
                { brand: { $regex: keywordRegex.join("|"), $options: "i" } },
                { description: { $regex: keywordRegex.join("|"), $options: "i" } }
            ];
        }

        // Find relevant products
        const products = await Product.find(query)
            .sort({ rating: -1 })
            .limit(5)
            .lean();

        const reply = products.length > 0
            ? `I found ${products.length} product(s) that may interest you!`
            : "Sorry, I couldn't find matching products. Try another product name, category, brand, or budget.";

        res.status(200).json({
            reply,
            products
        });

    } catch (error) {
        console.error("Chatbot error:", error);

        res.status(500).json({
            message: "Something went wrong while searching for products."
        });
    }
});

module.exports = router;
