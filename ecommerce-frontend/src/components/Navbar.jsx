
import { Link } from "react-router-dom";
import { User, Sparkles, Sun, Moon } from "lucide-react";
import Chatbot from "./Chatbot";
import "../styles/Navbar.css";

function Navbar({
    chatOpen,
    setChatOpen,
    theme,
    toggleTheme
}) {

    return (
        <>
            <header className={`navbar ${chatOpen ? "navbar-hidden" : ""}`}>

                <div className="navbar-store">
                    <Link to="/home">Shopease</Link>
                </div>

                <div className="navbar-actions">

                    {/* PROFILE */}

                    <Link
                        to="/profile"
                        className="navbar-profile"
                        aria-label="Profile"
                        title="Profile"
                    >
                        <User size={22} />
                    </Link>

                    {/* AI CHATBOT */}

                    <button
                        className="navbar-assistant"
                        onClick={() => setChatOpen(true)}
                        aria-label="Open AI assistant"
                        title="AI Assistant"
                    >
                        <Sparkles size={22} />
                    </button>

                    {/* THEME TOGGLE */}

                    <button
                        className="navbar-theme"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                        title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
                    >
                        {theme === "light" ? (
                            <Moon size={22} />
                        ) : (
                            <Sun size={22} />
                        )}
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
