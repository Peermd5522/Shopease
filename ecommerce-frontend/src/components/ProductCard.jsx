
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard(props) {
    const navigate = useNavigate();
    const product = props.product;

    const isWishlisted =
        props.wishlist?.some(
            item => item._id === product._id
        ) || false;

    return (
        <div
            className="product-card"
            onClick={() => navigate(`/product/${product._id}`)}
        >
            <div className="product-image">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                />

                <button
                    className={`wishlist-button ${isWishlisted ? "active" : ""}`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
                        e.stopPropagation();
                        props.toggleWishlist(product);
                    }}
                >
                    {isWishlisted ? "♥" : "♡"}
                </button>
            </div>

            <div className="product-info">

                <p className="product-brand">
                    {product.brand || product.category}
                </p>

                <div className="product-title-row">
                    <h3>{product.name}</h3>

                    <div className="product-rating">
                        <span>★</span>
                        {Number(product.rating || 0).toFixed(1)}
                    </div>
                </div>

                <div className="product-price-row">
                    <h2 className="product-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                    </h2>

                    <span className="product-stock">
                        {product.stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                    </span>
                </div>

                <div className="product-actions">
                    <span
                        className="view-details"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product._id}`);
                        }}
                    >
                        View Details ↗
                    </span>

                    <button
                        className="add-button"
                        disabled={product.stock <= 0}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.addToCart(product);
                        }}
                    >
                        Add +
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ProductCard;
