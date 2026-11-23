import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminProducts.css";
import { AuthContext } from "../../context/AuthContext";
import Toast from "../../components/Toast";
import { API_URL } from "../../config";

function AdminProducts() {

    const { token } = useContext(AuthContext);

    const [products, setProducts] = useState([]);

    const [deleteProduct, setDeleteProduct] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const navigate = useNavigate();


    // =========================
    // Fetch Products
    // =========================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/products`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                setProducts(data);

            } catch (error) {

                console.error(
                    "Error fetching products:",
                    error
                );

            }

        };

        fetchProducts();

    }, []);


    // =========================
    // Delete Product
    // =========================

    const handleDelete = async (id) => {

        try {

            const response = await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete product"
                );
            }


            // Show success toast

            setToastMessage(
                "Product deleted successfully"
            );

            setShowToast(true);


            setTimeout(() => {
                setShowToast(false);
            }, 2500);


            // Remove deleted product from UI

            setProducts((prevProducts) =>
                prevProducts.filter(
                    (product) => product._id !== id
                )
            );


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            alert(error.message);
        }
    };


    // =========================
    // Get Unique Categories
    // =========================

    const categories = [
        ...new Set(
            products
                .map((product) => product.category)
                .filter(Boolean)
        )
    ];


    // =========================
    // Filter Products
    // =========================

    const filteredProducts = products.filter((product) => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search.toLowerCase());


        const matchesCategory =
            category === "all" ||
            product.category === category;


        return matchesSearch && matchesCategory;

    });


    return (

        <div className="admin-products">


            <Toast
                show={showToast}
                message={toastMessage}
            />


            <div className="admin-products-header">

                <div>

                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage the products in your store.
                    </p>

                </div>


                <button
                    className="add-product-button"
                    onClick={() =>
                        navigate("/admin/products/add")
                    }
                >
                    + Add Product
                </button>

            </div>


            <div className="admin-products-toolbar">


                {/* Search */}

                <div className="admin-search">

                    <span className="admin-search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* Category */}

                <select
                    className="admin-category-filter"
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >

                    <option value="all">
                        All Categories
                    </option>


                    {categories.map((category) => (

                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>

                    ))}

                </select>

            </div>


            <p className="admin-product-count">

                {filteredProducts.length}{" "}

                {filteredProducts.length === 1
                    ? "product"
                    : "products"}

            </p>


            <div className="admin-products-grid">

                {filteredProducts.length > 0 ? (

                    filteredProducts.map((product) => (

                        <div
                            className="admin-product-card"
                            key={product._id}
                        >


                            {/* Product Image */}

                            <div className="admin-product-image">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                />

                            </div>


                            {/* Product Information */}

                            <div className="admin-product-info">

                                <h3>
                                    {product.name}
                                </h3>


                                <p className="admin-product-category">
                                    {product.category}
                                </p>


                                <p className="admin-product-price">
                                    ₹{product.price}
                                </p>

                            </div>


                            {/* Actions */}

                            <div className="admin-product-actions">


                                {/* Edit */}

                                <button
                                    className="edit-product-button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/products/edit/${product._id}`
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                {/* Delete */}

                                <button
                                    className="delete-product-button"
                                    onClick={() =>
                                        setDeleteProduct(product)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="admin-products-empty">

                        <h2>
                            No products found
                        </h2>

                        <p>
                            Try changing your search or category.
                        </p>

                        <button
                            onClick={() => {

                                setSearch("");
                                setCategory("all");

                            }}
                        >
                            Clear Filters
                        </button>

                    </div>

                )}

            </div>


            {deleteProduct && (

                <div className="delete-modal-overlay">

                    <div className="delete-modal">


                        <h2>
                            Delete Product?
                        </h2>


                        <p>
                            Are you sure you want to delete{" "}

                            <strong>
                                {deleteProduct.name}
                            </strong>
                            ?
                        </p>


                        <div className="delete-modal-actions">


                            {/* Cancel */}

                            <button
                                className="cancel-delete-button"
                                onClick={() =>
                                    setDeleteProduct(null)
                                }
                            >
                                Cancel
                            </button>


                            {/* Confirm Delete */}

                            <button
                                className="confirm-delete-button"
                                onClick={() => {

                                    handleDelete(
                                        deleteProduct._id
                                    );

                                    setDeleteProduct(null);

                                }}
                            >
                                Delete
                            </button>


                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default AdminProducts;