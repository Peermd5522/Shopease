
import { Link } from "react-router-dom";
import { User, Sparkles } from "lucide-react";
import Chatbot from "./Chatbot";
import "../styles/Navbar.css";

function Navbar({ chatOpen, setChatOpen }) {

    return (
        <>
            <header className={`navbar ${chatOpen ? "navbar-hidden" : ""}`}>

                <div className="navbar-store">
                    <Link to="/home">Shopease</Link>
                </div>

                <div className="navbar-actions">

                    <Link
                        to="/profile"
                        className="navbar-profile"
                        aria-label="Profile"
                    >
                        <User size={22} />
                    </Link>

                    <button
                        className="navbar-assistant"
                        onClick={() => setChatOpen(true)}
                        aria-label="Open AI assistant"
                    >
                        <Sparkles size={22} />
                    </button>

                </div>
            </header>

            <Chatbot
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
            />
        </>
    );
}

export default Navbar;
