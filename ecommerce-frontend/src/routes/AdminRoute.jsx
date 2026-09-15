import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {

    const { user, loading } = useContext(AuthContext);


    // Wait until authentication state is loaded

    if (loading) {
        return null;
    }


    // Not logged in

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // Logged in but not an admin

    if (user.role !== "admin") {
        return (
            <Navigate
                to="/home"
                replace
            />
        );
    }


    // Admin

    return children;
}

export default AdminRoute;