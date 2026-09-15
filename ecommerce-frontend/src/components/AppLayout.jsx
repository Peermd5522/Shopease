import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

function AppLayout({ children, navbarProps }) {

    const location = useLocation();

    const isAdminRoute =
        location.pathname.startsWith("/admin");

    const isAuthRoute =
        location.pathname === "/login" ||
        location.pathname === "/signup";

    if (isAuthRoute) {
        return children;
    }

    if (isAdminRoute) {
        return (
            <>
                <AdminNavbar />

                {children}
            </>
        );
    }

    return (
        <>
            <Navbar {...navbarProps} />

            {children}
        </>
    );
}

export default AppLayout;