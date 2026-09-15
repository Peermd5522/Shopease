const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    
    brand: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    category: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    description: {
        type: String
    },

    rating: {
        type: Number,
        default: 0
    }

});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;