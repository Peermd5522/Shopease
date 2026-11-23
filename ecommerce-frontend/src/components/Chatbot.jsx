
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send } from "lucide-react";
import { API_URL } from "../config";
import "./Chatbot.css";

function Chatbot({ isOpen, onClose }) {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hi! Welcome to ShopEase. How can I help you find a product?"
        }
    ]);

    const handleSend = async () => {
        const userMessage = message.trim();

        if (!userMessage || isLoading) return;

        setMessages((previous) => [
            ...previous,
            { role: "user", text: userMessage }
        ]);

        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/chatbot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "bot",
                    text: data.reply,
                    products: data.products || []
                }
            ]);

        } catch (error) {
            console.error("Chatbot error:", error);

            setMessages((previous) => [
                ...previous,
                {
                    role: "bot",
                    text: "Sorry, I couldn't connect to the server. Please try again."
                }
            ]);

        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-container">
            <div className="chatbot-window">

                <div className="chatbot-header">
                    <div>
                        <h3>ShopEase Assistant</h3>
                        <span>Online</span>
                    </div>

                    <button onClick={onClose} aria-label="Close assistant">
                        <X size={20} />
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((item, index) => (
                        <div key={index}>
                            <div className={`chat-message ${item.role}`}>
                                {item.text}
                            </div>

                            {item.products?.length > 0 && (
                                <div className="chatbot-product-list">
                                    {item.products.map((product) => (
                                        <div
                                            className="chatbot-product-card"
                                            key={product._id}
                                        >
                                            <button
                                                className="chatbot-product-name"
                                                onClick={() =>
                                                    navigate(`/product/${product._id}`)
                                                }
                                            >
                                                {product.name}
                                            </button>

                                            <p>₹{product.price}</p>

                                            <p>
                                                ⭐ {product.rating || 0}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chat-message bot">
                            Finding products...
                        </div>
                    )}
                </div>

                <div className="chatbot-input">
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                    />

                    <button
                        onClick={handleSend}
                        disabled={isLoading || !message.trim()}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Chatbot;
