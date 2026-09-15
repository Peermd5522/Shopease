import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    return (
        <div className="admin-dashboard">

            <h1>Admin Dashboard</h1>

            <p>Manage your store from one place.</p>

            <div className="admin-grid">

                <button
                    className="admin-card"
                    onClick={() => navigate("/admin/products")}
                >
                    <span className="admin-card-icon">📦</span>
                    <span className="admin-card-title">
                        Manage Products
                    </span>
                    <span className="admin-card-description">
                        View and manage your products.
                    </span>
                </button>

                <button
                    className="admin-card"
                    onClick={() => navigate("/admin/products/add")}
                >
                    <span className="admin-card-icon">➕</span>
                    <span className="admin-card-title">
                        Add Product
                    </span>
                    <span className="admin-card-description">
                        Add a new product to your store.
                    </span>
                </button>

                <button
                    className="admin-card"
                    disabled
                >
                    <span className="admin-card-icon">📋</span>
                    <span className="admin-card-title">
                        Orders
                    </span>
                    <span className="admin-card-description">
                        Coming soon
                    </span>
                </button>

                <button
                    className="admin-card"
                    disabled
                >
                    <span className="admin-card-icon">👥</span>
                    <span className="admin-card-title">
                        Customers
                    </span>
                    <span className="admin-card-description">
                        Coming soon
                    </span>
                </button>

            </div>

        </div>
    );
}

export default AdminDashboard;