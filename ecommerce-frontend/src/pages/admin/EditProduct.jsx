import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/admin/EditProduct.css";
import Toast from "../../components/Toast";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [formData, setFormData] = useState({
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


    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const response = await fetch(
                    `http://localhost:3000/products/${id}`
                );

                if (!response.ok) {
                    throw new Error("Product not found");
                }

                const data = await response.json();

                setProduct(data);

                setFormData({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    price: data.price,
                    rating: data.rating,
                    stock: data.stock,
                    brand: data.brand,
                    image: data.image
                });

            } catch (error) {

                console.error(
                    "Error fetching product:",
                    error
                );

            }

        };

        fetchProduct();

    }, [id]);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                `http://localhost:3000/products/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...formData,
                        price: Number(formData.price),
                        rating: Number(formData.rating),
                        stock: Number(formData.stock)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update product"
                );
            }

            setToastMessage("Product updated successfully");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 2500);

            // navigate(`/product/${id}`);

        } catch (error) {

            console.error(
                "Update error:",
                error
            );

            alert(error.message);

        }

    };


    if (!product) {
        return <h2 className="edit-product-loading">Loading...</h2>;
    }


    return (
        <div className="edit-product">

            <Toast
                show={showToast}
                message={toastMessage}
            />

            <div className="edit-product-header">

                <h1>Edit Product</h1>

                <p>
                    Update the details of this product.
                </p>

            </div>


            <form
                className="edit-product-form"
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
                        value={formData.name}
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
                        value={formData.description}
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
                            value={formData.brand}
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
                            value={formData.category}
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
                            value={formData.price}
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
                            value={formData.rating}
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
                            value={formData.stock}
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
                        value={formData.image}
                        onChange={handleChange}
                    />

                </div>


                <button
                    type="submit"
                    className="update-product-button"
                >
                    Update Product
                </button>

            </form>

        </div>
    );
}

export default EditProduct;