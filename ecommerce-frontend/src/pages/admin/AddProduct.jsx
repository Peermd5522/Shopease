import { useState } from "react";
import Toast from "../../components/Toast";
import "../../styles/admin/AddProduct.css";
import { API_URL } from "../../config";

function AddProduct() {

    const [product, setProduct] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        rating: "",
        stock: "",
        brand: "",
        image: ""
    });


    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                `${API_URL}/products`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...product,
                        price: Number(product.price),
                        rating: Number(product.rating),
                        stock: Number(product.stock)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create product"
                );
            }

            console.log(
                "Product created:",
                data
            );

            setToastMessage("Product added successfully");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 2500);

            
            setProduct({
                name: "",
                description: "",
                category: "",
                price: "",
                rating: "",
                stock: "",
                brand: "",
                image: ""
            });

        } catch (error) {

            console.error(
                "Error:",
                error
            );

            alert(error.message);
        }
    };

    return (
        <div className="add-product">

            <Toast
                show={showToast}
                message={toastMessage}
            />

            <div className="add-product-header">

                <h1>Add Product</h1>

                <p>
                    Add a new product to your store.
                </p>

            </div>


            <form
                className="add-product-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">

                    <label htmlFor="name">
                        Product Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={handleChange}
                    />

                </div>


                <div className="form-group">

                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter product description"
                        value={product.description}
                        onChange={handleChange}
                        rows="5"
                    />

                </div>


                <div className="form-row">

                    <div className="form-group">

                        <label htmlFor="brand">
                            Brand
                        </label>

                        <input
                            id="brand"
                            type="text"
                            name="brand"
                            placeholder="Enter brand"
                            value={product.brand}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="category">
                            Category
                        </label>

                        <input
                            id="category"
                            type="text"
                            name="category"
                            placeholder="Enter category"
                            value={product.category}
                            onChange={handleChange}
                        />

                    </div>

                </div>


                <div className="form-row">

                    <div className="form-group">

                        <label htmlFor="price">
                            Price
                        </label>

                        <input
                            id="price"
                            type="number"
                            name="price"
                            placeholder="Enter price"
                            value={product.price}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="rating">
                            Rating
                        </label>

                        <input
                            id="rating"
                            type="number"
                            name="rating"
                            placeholder="Enter rating"
                            value={product.rating}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="stock">
                            Stock
                        </label>

                        <input
                            id="stock"
                            type="number"
                            name="stock"
                            placeholder="Enter stock"
                            value={product.stock}
                            onChange={handleChange}
                        />

                    </div>

                </div>


                <div className="form-group">

                    <label htmlFor="image">
                        Image URL
                    </label>

                    <input
                        id="image"
                        type="text"
                        name="image"
                        placeholder="Enter image URL"
                        value={product.image}
                        onChange={handleChange}
                    />

                </div>


                <button
                    type="submit"
                    className="submit-product-button"
                >
                    Add Product
                </button>

            </form>

        </div>
    );
}

export default AddProduct;