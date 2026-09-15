import { useState } from "react";
import "../../styles/auth/Signup.css";

function Signup() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = (e) => {

        e.preventDefault();

        console.log("User:", user);

    };


    return (
        <div className="auth-page">

            <div className="auth-container">

                <h1>Create your account.</h1>

                <p className="auth-subtitle">
                    Join ShopEase today.
                </p>


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">

                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={user.name}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="auth-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={user.email}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="auth-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={user.password}
                            onChange={handleChange}
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Create Account
                    </button>

                </form>


                <p className="auth-switch">

                    Already have an account?

                    <span>
                        Sign in
                    </span>

                </p>

            </div>

        </div>
    );
}

export default Signup;