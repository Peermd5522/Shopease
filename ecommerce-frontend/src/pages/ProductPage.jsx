
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/ProductPage.css";
import { API_URL } from "../config";

function ProductPage(props) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setProduct(null);
        setError("");

        fetch(`${API_URL}/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                return response.json();
            })
            .then((data) => setProduct(data))
            .catch((error) => {
                console.error("Error fetching product:", error);
                setError(error.message);
            });
    }, [id]);

    if (error) {
        return (
            <div className="product-page">
                <h2>{error}</h2>
                <button onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
        );
    }

    if (!product) {
        return <div className="product-page">Loading product...</div>;
    }

    const relatedProducts = (props.products || [])
        .filter(
            (item) =>
                item.category === product.category &&
                item._id !== product._id
        )
        .slice(0, 4);

    const rating = Math.max(
        0,
        Math.min(5, Math.round(Number(product.rating) || 0))
    );

    const inStock = Number(product.stock) > 0;

    return (
        <main className="product-page">

            <button
                className="product-back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <section className="product-details">

                {/* Product Image */}
                <div className="product-gallery">
                    <div className="product-main-image">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                            />
                        )}
                    </div>
                </div>

                {/* Product Information */}
                <div className="product-description-panel">

                    <p className="product-brand">
                        {product.brand || product.category}
                    </p>

                    <h1 className="product-heading">
                        {product.name}
                    </h1>

                    <div className="product-description-rating">

                        <p className="product-detail-description">
                            {product.description}
                        </p>

                        <div
                            className="product-rating-stars"
                            aria-label={`Rating ${product.rating} out of 5`}
                        >
                            {Array.from({ length: 5 }, (_, index) => (
                                <span
                                    key={index}
                                    className={
                                        index < rating ? "filled" : ""
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                    </div>

                    <div className="product-detail-divider" />

                    {/* Price and Stock */}
                    <div className="product-price-row">

                        <h2 className="product-detail-price">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                        </h2>

                        <p
                            className={`product-availability ${
                                inStock ? "available" : "unavailable"
                            }`}
                        >
                            {inStock ? "● In Stock" : "Out of Stock"}
                        </p>

                    </div>

                    <div className="product-detail-divider" />

                    {/* Add to Bag */}
                    <button
                        className="product-add-to-cart"
                        onClick={() => props.addToCart(product)}
                        disabled={!inStock}
                    >
                        {inStock ? "Add to Bag" : "Out of Stock"}
                    </button>

                    <div className="product-detail-divider" />

                </div>

            </section>

            {/* Related Products */}
            <section className="related-section">

                <h2>Related Products</h2>

                <div className="products">
                    {relatedProducts.map((item) => (
                        <ProductCard
                            key={item._id}
                            product={item}
                            addToCart={props.addToCart}
                            wishlist={props.wishlist}
                            toggleWishlist={props.toggleWishlist}
                        />
                    ))}
                </div>

            </section>

        </main>
    );
}

export default ProductPage;
