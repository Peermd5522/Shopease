
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

function AppLayout({ children, navbarProps, chatOpen, setChatOpen }) {

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
            <Navbar
                {...navbarProps}
                chatOpen={chatOpen}
                setChatOpen={setChatOpen}
            />

            {children}
        </>
    );
}

export default AppLayout;
