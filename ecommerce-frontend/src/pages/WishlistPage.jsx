import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/WishlistPage.css";

function WishlistPage(props) {
    return (

        <div className="wishlist-page">

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h1>My Wishlist ❤️</h1>

            {props.wishlist.length === 0 ? (

                <p>Your wishlist is empty.</p>

            ) : (

                <div className="products">

                    {props.wishlist.map((item) => (

                        <ProductCard
                            key={item._id}
                            product={item}
                            addToCart={props.addToCart}
                            wishlist={props.wishlist}
                            toggleWishlist={props.toggleWishlist}
                        />

                    ))}

                </div>

            )}


        </div>

    );
}

export default WishlistPage;