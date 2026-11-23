
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";

import Hero from "./components/Hero";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";

import WishlistPage from "./pages/WishlistPage";

import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminDashboard from "./pages/admin/AdminDashboard";

import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

import ProtectedRoute from "./routes/ProtectedRoute";

import { API_URL } from "./config";

import { useState, useEffect } from "react";
import "./App.css";


const featuredCategories = [
    "smartphones",
    "laptops",
    "mens-shirts",
    "womens-dresses",
    "beauty",
    "fragrances",
    "furniture",
    "groceries"
];


function App() {

    const location = useLocation();


    // CART

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");

        return savedCart ? JSON.parse(savedCart) : [];
    });


    // WISHLIST

    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("wishlist");

        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });


    // PRODUCTS AND FILTERS

    const [search, setSearch] = useState("");

    const [products, setProducts] = useState([]);

    const [category, setCategory] = useState("all");

    const [searchOpen, setSearchOpen] = useState(false);


    // SORTING

    const sort = "default";


    // TOAST

    const [showToast, setShowToast] = useState(false);


    // CHATBOT

    const [chatOpen, setChatOpen] = useState(false);


    // THEME

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });


    // SEARCH CONTROLS

    const closeSearch = () => {
        setSearchOpen(false);
    };

    const toggleSearch = () => {
        setSearchOpen((prev) => !prev);
    };


    // SAVE CART

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);


    // SAVE WISHLIST

    useEffect(() => {
        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );
    }, [wishlist]);


    // SAVE THEME

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);


    // FETCH PRODUCTS

    useEffect(() => {

        fetch(`${API_URL}/products`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });

    }, []);


    // GET CATEGORIES

    const categories = [
        ...new Set(
            products.map((product) => product.category)
        )
    ].filter((category) =>
        featuredCategories.includes(category)
    );


    // FILTER PRODUCTS BY CATEGORY

    const filteredProducts = products.filter((item) => {

        const matchesCategory =
            category === "all" ||

            (category === "fashion"
                ? [
                    "mens-shirts",
                    "mens-shoes",
                    "mens-watches",
                    "womens-dresses",
                    "womens-shoes",
                    "womens-bags",
                    "womens-jewellery"
                ].includes(item.category)

                : item.category === category);

        return matchesCategory;

    });


    // SEARCH RANKING + SORTING

    const sortedProducts = [...filteredProducts];

    const searchTerm = search.trim().toLowerCase();

    const getSearchScore = (product) => {

        const name = (product.name || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const description = (product.description || "").toLowerCase();

        if (name === searchTerm) return 5;
        if (name.startsWith(searchTerm)) return 4;
        if (name.includes(searchTerm)) return 3;
        if (brand.includes(searchTerm)) return 2;
        if (category.includes(searchTerm)) return 1;
        if (description.includes(searchTerm)) return 1;

        return 0;
    };

    sortedProducts.sort((a, b) => {

        if (searchTerm) {

            const scoreDifference =
                getSearchScore(b) - getSearchScore(a);

            if (scoreDifference !== 0) {
                return scoreDifference;
            }
        }

        if (sort === "low-high") return a.price - b.price;

        if (sort === "high-low") return b.price - a.price;

        if (sort === "a-z") {
            return (a.name || "").localeCompare(b.name || "");
        }

        if (sort === "z-a") {
            return (b.name || "").localeCompare(a.name || "");
        }

        return 0;
    });


    // ADD TO CART

    function addToCart(product) {

        const existingItem = cart.find(
            (item) => item._id === product._id
        );

        if (existingItem) {

            setCart(
                cart.map((item) =>
                    item._id === product._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1,
                },
            ]);

        }

        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 2500);

    }


    // TOGGLE WISHLIST

    function toggleWishlist(product) {

        setWishlist((prevWishlist) => {

            const exists = prevWishlist.find(
                (item) => item._id === product._id
            );

            if (exists) {

                return prevWishlist.filter(
                    (item) => item._id !== product._id
                );

            }

            return [...prevWishlist, product];

        });

    }


    // TOGGLE THEME

    function toggleTheme() {

        setTheme((prev) =>
            prev === "light" ? "dark" : "light"
        );

    }


    // DELETE CART ITEM

    function deleteItem(id) {

        setCart(
            cart.filter((item) => item._id !== id)
        );

    }


    // CLEAR CART

    function clearCart() {
        setCart([]);
    }


    // INCREASE QUANTITY

    function increaseQuantity(id) {

        setCart(
            cart.map((item) =>
                item._id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                    : item
            )
        );

    }


    // DECREASE QUANTITY

    function decreaseQuantity(id) {

        const existingItem = cart.find(
            (item) => item._id === id
        );

        if (existingItem && existingItem.quantity > 1) {

            setCart(
                cart.map((item) =>
                    item._id === id
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item
                )
            );

        } else {

            deleteItem(id);

        }

    }


    // CART TOTAL

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );


    // CART COUNT

    const cartCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );


    // RENDER

    return (

        <div className="app">

            <div className={theme}>

                <Toast
                    show={showToast}
                    message="Added to Bag"
                />


                {/* APP LAYOUT */}

                <AppLayout
                    chatOpen={chatOpen}
                    setChatOpen={setChatOpen}
                    navbarProps={{
                        cartCount,
                        toggleSearch,
                        searchOpen,
                        closeSearch,
                        search,
                        setSearch,
                        theme,
                        toggleTheme
                    }}
                />


                {/* ROUTES */}

                <Routes>

                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />


                    {/* HOME */}

                    <Route
                        path="/home"
                        element={
                            <>

                                <Hero />

                                <Home
                                    products={sortedProducts}
                                    addToCart={addToCart}
                                    category={category}
                                    setCategory={setCategory}
                                    toggleWishlist={toggleWishlist}
                                    wishlist={wishlist}
                                />

                            </>
                        }
                    />


                    {/* PRODUCT DETAILS */}

                    <Route
                        path="/product/:id"
                        element={
                            <ProductPage
                                products={products}
                                addToCart={addToCart}
                                toggleWishlist={toggleWishlist}
                                wishlist={wishlist}
                            />
                        }
                    />


                    {/* CART */}

                    <Route
                        path="/cart"
                        element={
                            <CartPage
                                cart={cart}
                                total={total}
                                deleteItem={deleteItem}
                                increaseQuantity={increaseQuantity}
                                decreaseQuantity={decreaseQuantity}
                            />
                        }
                    />


                    {/* CHECKOUT */}

                    <Route
                        path="/checkout"
                        element={
                            <CheckoutPage
                                cart={cart}
                                total={total}
                                clearCart={clearCart}
                            />
                        }
                    />


                    {/* ORDER SUCCESS */}

                    <Route
                        path="/order-success"
                        element={<OrderSuccessPage />}
                    />


                    {/* WISHLIST */}

                    <Route
                        path="/wishlist"
                        element={
                            <WishlistPage
                                wishlist={wishlist}
                                toggleWishlist={toggleWishlist}
                                addToCart={addToCart}
                            />
                        }
                    />


                    {/* ADMIN DASHBOARD */}

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />


                    {/* ADD PRODUCT */}

                    <Route
                        path="/admin/products/add"
                        element={
                            <AdminRoute>
                                <AddProduct />
                            </AdminRoute>
                        }
                    />


                    {/* EDIT PRODUCT */}

                    <Route
                        path="/admin/products/edit/:id"
                        element={
                            <AdminRoute>
                                <EditProduct />
                            </AdminRoute>
                        }
                    />


                    {/* ADMIN PRODUCTS */}

                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <AdminProducts />
                            </AdminRoute>
                        }
                    />

                </Routes>


                {/* BOTTOM NAVIGATION */}

                {location.pathname !== "/login" &&
                    location.pathname !== "/signup" &&
                    location.pathname !== "/profile" && (

                        <BottomNav
                            search={search}
                            setSearch={setSearch}
                            searchOpen={searchOpen}
                            setSearchOpen={setSearchOpen}
                            category={category}
                            setCategory={setCategory}
                            categories={categories}
                            chatOpen={chatOpen}
                        />

                    )}

            </div>

        </div>

    );

}

export default App;
