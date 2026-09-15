import { useState } from "react";
import { useNavigate } from "react-router-dom";


function CheckoutPage(props) {

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const orderItems = props.cart.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));

        const response = await fetch("http://localhost:3000/orders", {
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
            throw new Error(data.message);
        }

        console.log("Order placed:", data);

        props.clearCart();
        navigate("/order-success");

    } catch (error) {

        console.error("Order failed:", error);

    }

};

    return (
        <form onSubmit={handleSubmit}>

            <h1>Checkout</h1>

            <div>

                <h2>Delivery Details</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) =>
                        setCustomerName(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                />

                <textarea
                    placeholder="Delivery Address"
                    value={address}
                    onChange={(e) =>
                        setAddress(e.target.value)
                    }
                />

            </div>

            <div>

                <h2>Order Summary</h2>

                {props.cart.map((item) => (

                    <div key={item._id}>

                        <p>{item.name}</p>

                        <p>
                            ₹{item.price} × {item.quantity}
                        </p>

                    </div>

                ))}

                <h3>
                    Total: ₹{props.total}
                </h3>

                <button type="submit">
                    Place Order
                </button>

            </div>

        </form>
    );
}

export default CheckoutPage;