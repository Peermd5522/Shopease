
import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return null;

        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    const [loading] = useState(false);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
