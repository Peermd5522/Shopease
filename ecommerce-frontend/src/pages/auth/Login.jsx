import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth/Login.css";
import { API_URL } from "../../config";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setUser, setToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Login failed"
            );
        }

        console.log("Login successful:", data);

        setUser(data.user);
        setToken(data.token);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("User stored in AuthContext:", data.user);
        console.log("Token stored in AuthContext:", data.token);

        navigate("/home");

    } catch (error) {

        console.error("Login error:", error);

        alert(error.message);
    }
};

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Sign in</h1>

                <p className="login-subtitle">
                    Sign in to your account.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="login-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                        />

                    </div>


                    <div className="login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="username"
                        />

                    </div>


                    <button
                        type="submit"
                        className="login-button"
                    >
                        Sign In
                    </button>

                </form>


                <p className="signup-link">

                    Don't have an account?{" "}

                    <Link to="/signup">
                        Sign up
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;