import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/ProductPage.css";

function ProductPage(props) {

    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Product not found");
            }

            return response.json();
        })
        .then((data) => {
            setProduct(data);
        })
        .catch((error) => {
            console.error("Error fetching product:", error);
            setError(error.message);
        });
    }, [id]);



    if (error) {
    return (
        <div className="product-page">
            <h2>{error}</h2>

            <button
                className="back-button"
                onClick={() => navigate("/")}
            >
                ← Back to Home
            </button>
        </div>
    );
}

if (!product) {
    return <h2>Loading...</h2>;
}


    const relatedProducts = props.products
        .filter(
            (item) =>
                item.category === product.category &&
                item._id !== product._id
        )
        .slice(0, 4);

    return (

        <div className="product-page">

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <div className="product-details">

                {/* LEFT SIDE */}
                <div className="product-gallery">

                    <div className="product-image">

                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                            />
                        )}

                    </div>



                </div>

                {/* RIGHT SIDE */}
                <div className="product-info">

                    <p className="brand">
                        {product.brand}
                    </p>

                    <h1>{product.name}</h1>


                    <div className="price-row">

                        <h2 className="price">
                            ₹{product.price}
                        </h2>

                        

                    </div>


                    <p className="stock">

                        {product.stock > 0
                            ? `✓ ${product.stock} in stock`
                            : "Out of Stock"}

                    </p>


                    <p className="rating">

                        ⭐ {product.rating}

                        <span className="rating-text">
                            / 5
                        </span>
                    </p>


                    <p className="delivery">
                        🚚 Free Delivery
                    </p>

                    <p className="returns">
                        ↺ 30-Day Returns
                    </p>


                    <p className="description">
                        {product.description}
                    </p>

                    <p className="category">
                        Category:
                        <strong> {product.category}</strong>
                    </p>

                    <button
                        className="add-button"
                        onClick={() => props.addToCart(product)}
                    >
                        Add
                    </button>

                </div>

            </div>

            <div className="related-section">

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

            </div>

        </div>

    );
}

export default ProductPage;