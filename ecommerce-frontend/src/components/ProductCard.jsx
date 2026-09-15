import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard(props) {

    const navigate = useNavigate();

    const isWishlisted =
    props.wishlist?.some(
        item => item._id === props.product._id
    ) || false;

    return (

        <div
            className="product-card"
            onClick={() => navigate(`/product/${props.product._id}`)}
        >

            <button
                className="wishlist-button"
                onClick={(e) => {

                    e.stopPropagation();

                    props.toggleWishlist(props.product);

                }}
            >

                {isWishlisted ? "❤️" : "🤍"}

            </button>

            <div className="product-image">

                <img
                    src={props.product.image}
                    alt={props.product.name}
                />

            </div>

            <div className="product-info">

                <p className="product-brand">
                    {props.product.brand}
                </p>

                <h3>
                    {props.product.name}
                </h3>

                <p className="product-rating">
                    ⭐ {props.product.rating}
                </p>

                <h2 className="product-price">
                    ₹{props.product.price}
                </h2>

                <p className="product-stock">
                    {props.product.stock > 10
                        ? `Only ${props.product.stock} left`
                        : "Almost Sold Out"}
                </p>

            </div>

            <button
                className="add-button"
                onClick={(e) => {

                    e.stopPropagation();

                    props.addToCart(props.product);

                }}
            >

                Add

            </button>

        </div>

    );

}

export default ProductCard;