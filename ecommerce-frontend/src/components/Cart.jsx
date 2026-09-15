import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart(props) {

    const navigate = useNavigate();

    return (

        <div className="cart-page">

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h1 className="cart-title">
                Shopping Bag
            </h1>

            <div className="cart-products">

                {props.cart.length === 0 ? (

                    <div className="empty-cart">

                        <h2>Your bag is empty</h2>

                        <p>Add something beautiful.</p>

                    </div>

                ) : (

                    props.cart.map((item) => (

                        <CartItem
                            key={item._id}
                            item={item}
                            deleteItem={props.deleteItem}
                            increaseQuantity={props.increaseQuantity}
                            decreaseQuantity={props.decreaseQuantity}
                        />

                    ))

                )}

            </div>

            {props.cart.length > 0 && (

                <div className="cart-summary">

                    <div className="summary-row">

                        <span>Subtotal</span>

                        <span>₹{props.total.toFixed(2)}</span>

                    </div>

                    <div className="summary-row">

                        <span>Shipping</span>

                        <span>Free</span>

                    </div>

                    <div className="summary-divider"></div>

                    <div className="total-row">

                        <span>Total</span>

                        <div className="checkout-section">

                            <span>₹{props.total.toFixed(2)}</span>

                            <button
                                className="checkout-button"
                                onClick={() => navigate("/checkout")}
                            >
                                Checkout
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Cart;