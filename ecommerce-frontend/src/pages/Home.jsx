
import ProductCard from "../components/ProductCard";
import Chatbot from "../components/Chatbot";
import "./Home.css";

function Home(props) {
    return (
        <div className="home">

            {/* Hero Section */}
            <section className="home-hero">
                <div className="hero-content">
                    <span className="hero-eyebrow">
                        THE SHOP EASE COLLECTION
                    </span>

                    <h1>
                        Discover more.
                        <br />
                        Experience better.
                    </h1>

                    <p>
                        Thoughtfully selected products.
                        Everything you love, all in one place.
                    </p>

                    <a href="#shop-collection" className="hero-button">
                        Explore Collection
                        <span>↗</span>
                    </a>
                </div>
            </section>

            {/* Product Collection */}
            <section
                className="shop-collection"
                id="shop-collection"
            >
                <div className="collection-heading">
                    <div>
                        <span className="section-eyebrow">
                            CURATED FOR YOU
                        </span>

                        <h2>Explore our collection.</h2>
                    </div>

                    <p>
                        Find something you'll love.
                    </p>
                </div>

                <div className="products">
                    {props.products.map((item) => (
                        <ProductCard
                            key={item._id}
                            product={item}
                            addToCart={props.addToCart}
                            toggleWishlist={props.toggleWishlist}
                            wishlist={props.wishlist}
                        />
                    ))}
                </div>
            </section>

            <Chatbot />

        </div>
    );
}

export default Home;
