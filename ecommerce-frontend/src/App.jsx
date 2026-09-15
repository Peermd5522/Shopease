import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import AppLayout from "./components/AppLayout";


import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import AdminRoute from "./routes/AdminRoute";


import Home from "./pages/Home";
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


import {useState, useEffect} from "react";
import "./App.css";



function App() {

  const location = useLocation();


  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {

    const savedWishlist = localStorage.getItem("wishlist");

    return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
  });

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);

  const [category, setCategory] =useState("all");
  const [categories, setCategories] = useState([]);

  const [sort, setSort] = useState("default");

  const [searchOpen, setSearchOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const [toastProduct, setToastProduct] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });


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
  
  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

//useEffects cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

//wishlist
  useEffect(() => {
    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );
   }, [wishlist]);


//Dark Theme

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);


//API fetching
  useEffect(() => {
     fetch("http://localhost:3000/products")
     .then((response) => response.json())
     .then((data) =>{
        console.log(data)
        setProducts(data)
     });
  }, []);

  useEffect(() => {
    const uniqueCategories = [
        ...new Set(products.map((product) => product.category))
    ];

    const filtered = uniqueCategories.filter((category) =>
        featuredCategories.includes(category)
    );

    setCategories(filtered);
  }, [products]);


  const filteredProducts = products.filter((item) => {
    
      const matchesSearch =
          item.name.toLowerCase().includes(search.toLowerCase());

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

        return matchesSearch && matchesCategory;    
  });

  const sortedProducts = [...filteredProducts];

    if (sort === "low-high") {
    sortedProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
        sortedProducts.sort((a, b) => b.price - a.price);
    }

    if (sort === "a-z") {
        sortedProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (sort === "z-a") {
        sortedProducts.sort((a, b) =>
            b.name.localeCompare(a.name)
        );
    }

    // if (sort === "rating-low-high") {
    //     sortedProducts.sort((a, b) =>
    //         a.rating.rate - b.rating.rate
    //     );
    // }

    // if (sort === "rating-high-low") {
    //     sortedProducts.sort((a, b) =>
    //         b.rating.rate - a.rating.rate
    //     );
    // }

  // Add to Cart
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

    setToastProduct(product);
    setShowToast(true);
    setTimeout(() => {
    setShowToast(false);
    }, 2500);
  }


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

function toggleTheme() {
    setTheme((prev) =>
        prev === "light" ? "dark" : "light"
    );
}


  // Delete Item
  function deleteItem(id) {
    setCart(
      cart.filter((item) => item._id !== id)
    );
  }

  function clearCart() {
    setCart([]);
  }

  // Increase Quantity
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

  // Decrease Quantity
  function decreaseQuantity(id) {
    const existingItem = cart.find(
      (item) => item._id === id
    );

    if (existingItem.quantity > 1) {
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

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
  <div className="app">

    <div className={theme} >


    <Toast
        show={showToast}
        message="Added to Bag"
    />

    <AppLayout
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
></AppLayout>


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

      <Route
          path="/order-success"
          element={<OrderSuccessPage />}
      />

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

      <Route
          path="/admin"
          element={
              <AdminRoute>
                  <AdminDashboard />
              </AdminRoute>
          }
      />

      <Route
          path="/admin/products/add"
          element={
              <AdminRoute>
                  <AddProduct />
              </AdminRoute>
          }
      />

      <Route
          path="/admin/products/edit/:id"
          element={
              <AdminRoute>
                  <EditProduct />
              </AdminRoute>
          }
      />

      <Route
          path="/admin/products"
          element={
              <AdminRoute>
                  <AdminProducts />
              </AdminRoute>
          }
      />


    </Routes>

    {location.pathname !== "/login" &&
    location.pathname !== "/signup" && (
        <BottomNav
            search={search}
            setSearch={setSearch}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}

            category={category}
            setCategory={setCategory}

            categories={categories}
        />
    )}

    </div>

  </div>
  );
}

export default App;