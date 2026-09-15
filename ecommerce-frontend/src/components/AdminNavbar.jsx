import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/AdminNavbar.css";

function AdminNavbar() {

    const navigate = useNavigate();

    const {
        setUser,
        setToken
    } = useContext(AuthContext);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);

        navigate("/login");

    };


    return (

        <header className="admin-navbar">

            <div className="admin-navbar-logo">

                <NavLink to="/admin">
                    Store Admin
                </NavLink>

            </div>


            <nav className="admin-navbar-links">

                <NavLink
                    to="/admin"
                    end
                >
                    Dashboard
                </NavLink>

                <NavLink to="/admin/products">
                    Products
                </NavLink>

                <NavLink to="/admin/products/add">
                    Add Product
                </NavLink>

            </nav>


            <button
                className="admin-logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>

        </header>

    );
}

export default AdminNavbar;