
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { API_URL } from "../config";

function CheckoutPage(props) {
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const orderItems = props.cart.map((item) => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));

            const response = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customerName,
                    phone,
                    address,
                    items: orderItems,
                    total: props.total
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Order placement failed");
            }

            console.log("Order placed:", data);

            props.clearCart();
            navigate("/order-success");

        } catch (error) {
            console.error("Order failed:", error);
            setError(error.message || "Something went wrong.");
        }
    };

    return (
        <div className="checkout-page">

            <div className="checkout-header">
                <p className="checkout-eyebrow">SHOPEASE / CHECKOUT</p>
                <h1>Complete your order.</h1>
                <p>Just a few details before your order is on its way.</p>
            </div>

            <form className="checkout-layout" onSubmit={handleSubmit}>

                <section className="checkout-details">

                    <div className="checkout-section-heading">
                        <span className="checkout-step">01</span>
                        <div>
                            <h2>Delivery details</h2>
                            <p>Where should we deliver your order?</p>
                        </div>
                    </div>

                    <div className="checkout-fields">

                        <div className="checkout-field">
                            <label>Full name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="checkout-field">
                            <label>Phone number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="checkout-field">
                            <label>Delivery address</label>
                            <textarea
                                placeholder="Enter your complete delivery address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    {error && (
                        <p className="checkout-error">{error}</p>
                    )}

                </section>

                <aside className="checkout-summary">

                    <div className="checkout-section-heading">
                        <span className="checkout-step">02</span>
                        <div>
                            <h2>Order summary</h2>
                            <p>Review your items</p>
                        </div>
                    </div>

                    <div className="checkout-items">

                        {props.cart.map((item) => (
                            <div className="checkout-item" key={item._id}>

                                <div className="checkout-item-image">
                                    <img src={item.image} alt={item.name} />
                                    <span>{item.quantity}</span>
                                </div>

                                <div className="checkout-item-info">
                                    <h3>{item.name}</h3>
                                    <p>₹{item.price} × {item.quantity}</p>
                                </div>

                                <strong>
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </strong>

                            </div>
                        ))}

                    </div>

                    <div className="checkout-total">
                        <span>Total</span>
                        <strong>₹{Number(props.total).toFixed(2)}</strong>
                    </div>

                    <button
                        className="place-order-btn"
                        type="submit"
                        disabled={props.cart.length === 0}
                    >
                        Place Order <span>→</span>
                    </button>

                    <p className="checkout-secure-note">
                        <span>✓</span> Your order details are securely submitted.
                    </p>

                </aside>

            </form>
        </div>
    );
}

export default CheckoutPage;
