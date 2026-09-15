import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home(props){

    return (

        <div className="home">

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

        </div>

    );

}

export default Home;