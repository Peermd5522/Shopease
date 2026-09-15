import { Search, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {

    return (

        <header className="navbar">

            {/* Store */}

            <div className="navbar-store">

                <Link to="/home">
                    Store
                </Link>

            </div>


            {/* Profile */}

            <Link
                to="/profile"
                className="navbar-profile"
                aria-label="Profile"
            >

                <User size={1000} />

            </Link>

        </header>

    );
}

export default Navbar;