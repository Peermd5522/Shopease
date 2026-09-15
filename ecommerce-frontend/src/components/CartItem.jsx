import "./CartItem.css";

function CartItem(props) {

    return (

        <div className="cart-item">

            {/* Product Image */}

            <div className="cart-image">

                <img
                    src={props.item.image}
                    alt={props.item.name}
                />

            </div>

            {/* Product Information */}

            <div className="cart-info">

                <h2>{props.item.name}</h2>

                <p className="rating">
                  ★★★★★  {props.item.rating}
                </p>

                <p className="price">
                    ₹{props.item.price}
                </p>

            </div>

            {/* Quantity + Remove */}

            <div className="cart-actions">

                <div className="quantity-box">

                    <button
                        onClick={() =>
                            props.decreaseQuantity(props.item._id)
                        }
                    >
                        −
                    </button>

                    <span>{props.item.quantity}</span>

                    <button
                        onClick={() =>
                            props.increaseQuantity(props.item._id)
                        }
                    >
                        +
                    </button>

                </div>

                <button
                    className="remove-button"
                    onClick={() =>
                        props.deleteItem(props.item._id)
                    }
                >
                    Remove
                </button>

            </div>

        </div>

    );

}

export default CartItem;