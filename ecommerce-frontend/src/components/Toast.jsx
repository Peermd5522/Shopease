import "./Toast.css";

function Toast({ show, message = "Added to Bag" }) {

    if (!show) return null;

    return (

        <div className="toast">

            <div className="toast-icon">
                ✓
            </div>

            <div className="toast-content">

                <h4>{message}</h4>

            </div>

        </div>

    );

}

export default Toast;