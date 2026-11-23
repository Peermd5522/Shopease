import { Link } from "react-router-dom";
import "../styles/OrderSuccessPage.css";

function OrderSuccessPage() {
    return (
        <div className="order-success">

            <div className="success-content">

                <div className="success-icon">
                    <span>✓</span>
                </div>

                <h1>
                    Order Successfully Placed!
                </h1>

                <p>
                    Thank you for your purchase.
                    <br />
                    Your order has been confirmed.
                </p>

                <Link
                    to="/home"
                    className="continue-shopping"
                >
                    Continue Shopping
                    <span>→</span>
                </Link>

            </div>

        </div>
    );
}

export default OrderSuccessPage;