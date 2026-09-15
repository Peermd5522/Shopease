import { useEffect, useRef, useState } from "react";
import {
    Tag,
    LayoutGrid,
    Home as HomeIcon,
    Search,
    MoreHorizontal,
    ShoppingBag,
    Heart,
    X
} from "lucide-react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import "../styles/BottomNav.css";


function BottomNav({
    categories,
    category,
    setCategory,
    search,
    setSearch
}) {

    const navigate = useNavigate();
    const location = useLocation();


    /* =====================================================
       STATE
    ===================================================== */

    const [activeTab, setActiveTab] =
        useState("home");

    const [searchOpen, setSearchOpen] =
        useState(false);

    const [moreOpen, setMoreOpen] =
        useState(false);

    const [isDragging, setIsDragging] =
        useState(false);


    /* =====================================================
       REFS
    ===================================================== */

    const searchInputRef =
        useRef(null);

    const navRef =
        useRef(null);

    const indicatorRef =
        useRef(null);


    /* =====================================================
       TABS
    ===================================================== */

    const tabs = [
        "offer",
        "categories",
        "home",
        "search",
        "more"
    ];


    /* =====================================================
       ACTIVE TAB FROM URL
    ===================================================== */

    useEffect(() => {

        if (location.pathname === "/home") {

            setActiveTab("home");

        }

    }, [location.pathname]);


    /* =====================================================
       SEARCH AUTO FOCUS
    ===================================================== */

    useEffect(() => {

        if (
            searchOpen &&
            searchInputRef.current
        ) {

            searchInputRef.current.focus();

        }

    }, [searchOpen]);


    /* =====================================================
       CLOSE MORE WHEN CLICKING OUTSIDE
    ===================================================== */

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (!moreOpen) {
                return;
            }


            const morePanel =
                document.querySelector(
                    ".bottom-more-panel"
                );


            const bottomNav =
                navRef.current;


            if (
                morePanel &&
                !morePanel.contains(event.target) &&
                bottomNav &&
                !bottomNav.contains(event.target)
            ) {

                setMoreOpen(false);

                setActiveTab("home");

            }

        };


        document.addEventListener(
            "pointerdown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "pointerdown",
                handleOutsideClick
            );

        };

    }, [moreOpen]);


    /* =====================================================
       SEARCH
    ===================================================== */

    const handleSearch = () => {

        setMoreOpen(false);

        setActiveTab("search");

        setSearchOpen(true);

    };


    const closeSearch = () => {

        setSearchOpen(false);

        setActiveTab("home");

    };


    /* =====================================================
       MORE
    ===================================================== */

    const handleMore = () => {

        setSearchOpen(false);

        setMoreOpen((previous) => {

            const nextState =
                !previous;


            setActiveTab(
                nextState
                    ? "more"
                    : "home"
            );


            return nextState;

        });

    };


    /* =====================================================
       HOME
    ===================================================== */

    const handleHome = () => {

        setSearchOpen(false);

        setMoreOpen(false);

        setActiveTab("home");

        navigate("/home");

    };


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const handleCategories = () => {

        setSearchOpen(false);

        setMoreOpen(false);

        setActiveTab("categories");

    };


    /* =====================================================
       OFFER
    ===================================================== */

    const handleOffer = () => {

        setSearchOpen(false);

        setMoreOpen(false);

        setActiveTab("offer");

    };


    /* =====================================================
       SELECT TAB
       
       This is the important part.
       
       Dragging the glass onto a tab and releasing it
       now performs the actual operation.
    ===================================================== */

    const selectTab = (tab) => {

        setActiveTab(tab);


        switch (tab) {

            case "offer":

                handleOffer();

                break;


            case "categories":

                handleCategories();

                break;


            case "home":

                handleHome();

                break;


            case "search":

                handleSearch();

                break;


            case "more":

                handleMore();

                break;


            default:

                break;

        }

    };


    /* =====================================================
       GET TAB FROM POINTER
    ===================================================== */

    const getTabFromPointer = (clientX) => {

        if (!navRef.current) {
            return 0;
        }


        const navRect =
            navRef.current.getBoundingClientRect();


        const padding = 7;


        const usableWidth =
            navRect.width -
            padding * 2;


        const itemWidth =
            usableWidth /
            tabs.length;


        const pointerX =
            clientX -
            navRect.left -
            padding;


        let index =
            Math.floor(
                pointerX /
                itemWidth
            );


        index =
            Math.max(
                0,
                Math.min(
                    tabs.length - 1,
                    index
                )
            );


        return index;

    };


    /* =====================================================
       DRAG START
    ===================================================== */

    const handlePointerDown = (event) => {

        if (
            !navRef.current ||
            !indicatorRef.current
        ) {
            return;
        }


        event.preventDefault();


        setIsDragging(true);


        /*
           Close temporary panels while dragging.
        */

        setSearchOpen(false);

        setMoreOpen(false);


        /*
           Pointer capture keeps the glass attached
           to the pointer even if the pointer leaves
           the navbar.
        */

        try {

            indicatorRef.current.setPointerCapture(
                event.pointerId
            );

        } catch {

            // Pointer capture unavailable.

        }

    };


    /* =====================================================
       DRAG MOVE
    ===================================================== */

    const handlePointerMove = (event) => {

        if (
            !isDragging ||
            !navRef.current ||
            !indicatorRef.current
        ) {
            return;
        }


        const navRect =
            navRef.current.getBoundingClientRect();


        const indicator =
            indicatorRef.current;


        const indicatorWidth =
            indicator.offsetWidth;


        const padding = 7;


        /*
           Keep the glass inside the navbar.
        */

        const minX =
            padding;


        const maxX =
            navRect.width -
            indicatorWidth -
            padding;


        /*
           Pointer position.
        */

        let x =
            event.clientX -
            navRect.left -
            indicatorWidth / 2;


        x =
            Math.max(
                minX,
                Math.min(
                    maxX,
                    x
                )
            );


        /*
           Instead of directly changing transform,
           store the temporary X position in a CSS
           variable.

           This allows CSS to control the scale,
           reflection and animation independently.
        */

        indicator.style.setProperty(
            "--drag-x",
            `${x - padding}px`
        );


        /*
           Find which navigation item is currently
           underneath the CENTER of the glass.
        */

        const glassCenter =
            x +
            indicatorWidth / 2;


        const usableWidth =
            navRect.width -
            padding * 2;


        const itemWidth =
            usableWidth /
            tabs.length;


        let index =
            Math.floor(
                (glassCenter - padding) /
                itemWidth
            );


        index =
            Math.max(
                0,
                Math.min(
                    tabs.length - 1,
                    index
                )
            );


        const currentTab =
            tabs[index];


        /*
           Update the blue selected item immediately
           while dragging.
        */

        setActiveTab(currentTab);

    };


    /* =====================================================
       DRAG END
    ===================================================== */

    const handlePointerUp = (event) => {

        if (
            !isDragging ||
            !navRef.current ||
            !indicatorRef.current
        ) {
            return;
        }


        const selectedIndex =
            getTabFromPointer(
                event.clientX
            );


        const selectedTab =
            tabs[selectedIndex];


        /*
           Stop dragging first.
        */

        setIsDragging(false);


        /*
           Release pointer capture.
        */

        try {

            indicatorRef.current.releasePointerCapture(
                event.pointerId
            );

        } catch {

            // Already released.

        }


        /*
           Remove temporary drag position.

           CSS will now move the glass to the
           selected tab.
        */

        indicatorRef.current.style.removeProperty(
            "--drag-x"
        );


        /*
           Perform the actual operation.

           This is what makes dragging onto:
           
           Categories → category panel
           Home       → /home
           Search     → search bar
           More       → more panel
        */

        selectTab(selectedTab);

    };


    /* =====================================================
       DRAG CANCEL
    ===================================================== */

    const handlePointerCancel = (event) => {

        if (!isDragging) {
            return;
        }


        setIsDragging(false);


        if (indicatorRef.current) {

            try {

                indicatorRef.current.releasePointerCapture(
                    event.pointerId
                );

            } catch {

                // Already released.

            }


            indicatorRef.current.style.removeProperty(
                "--drag-x"
            );

        }


        /*
           Restore the current active position.
        */

        setActiveTab((current) => current);

    };


    /* =====================================================
       CATEGORY SELECTION
    ===================================================== */

    const handleCategorySelect = (value) => {

        setCategory(value);

        setActiveTab("home");

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>

            {/* =================================================
                CATEGORY PANEL
            ================================================= */}

            <div
                className={`
                    bottom-category-panel
                    ${
                        activeTab === "categories"
                            ? "category-panel-open"
                            : ""
                    }
                `}
            >

                <div className="bottom-category-header">

                    <div>

                        <h3>
                            Categories
                        </h3>

                        <p>
                            Browse products by category
                        </p>

                    </div>


                    <button
                        className="bottom-panel-close"
                        onClick={() => {
                            setActiveTab("home");
                        }}
                        aria-label="Close categories"
                    >

                        <X size={20} />

                    </button>

                </div>


                <div className="bottom-category-list">

                    <button
                        className={
                            category === "all"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            handleCategorySelect("all")
                        }
                    >

                        All

                    </button>


                    {categories.map((item) => (

                        <button
                            key={item}
                            className={
                                category === item
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleCategorySelect(item)
                            }
                        >

                            {item}

                        </button>

                    ))}

                </div>

            </div>


            {/* =================================================
                MORE PANEL
            ================================================= */}

            <div
                className={`
                    bottom-more-panel
                    ${
                        moreOpen
                            ? "more-panel-open"
                            : ""
                    }
                `}
            >

                <button
                    onClick={() => {

                        setMoreOpen(false);

                        setSearchOpen(false);

                        setActiveTab("home");

                        navigate("/cart");

                    }}
                    aria-label="Cart"
                >

                    <ShoppingBag size={22} />

                    <span>
                        Cart
                    </span>

                </button>


                <button
                    onClick={() => {

                        setMoreOpen(false);

                        setSearchOpen(false);

                        setActiveTab("home");

                        navigate("/wishlist");

                    }}
                    aria-label="Wishlist"
                >

                    <Heart size={22} />

                    <span>
                        Wishlist
                    </span>

                </button>

            </div>


            {/* =================================================
                SEARCH BAR
            ================================================= */}

            <div
                className={`
                    bottom-search-bar
                    ${
                        searchOpen
                            ? "bottom-search-open"
                            : ""
                    }
                `}
            >

                <Search size={21} />


                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />


                <button
                    className="bottom-search-close"
                    onClick={closeSearch}
                    aria-label="Close search"
                >

                    <X size={18} />

                </button>

            </div>


            {/* =================================================
                BOTTOM NAVIGATION
            ================================================= */}

            <nav
                ref={navRef}
                className={`
                    bottom-nav
                    ${
                        isDragging
                            ? "nav-dragging"
                            : ""
                    }
                `}
                data-active={activeTab}
            >

                {/* =================================================
                    LIQUID GLASS INDICATOR
                ================================================= */}

                <div
                    ref={indicatorRef}
                    className="bottom-nav-indicator"

                    onPointerDown={
                        handlePointerDown
                    }

                    onPointerMove={
                        handlePointerMove
                    }

                    onPointerUp={
                        handlePointerUp
                    }

                    onPointerCancel={
                        handlePointerCancel
                    }

                    aria-hidden="true"
                />


                {/* =================================================
                    OFFER
                ================================================= */}

                <button
                    className={`
                        bottom-nav-item
                        ${
                            activeTab === "offer"
                                ? "active"
                                : ""
                        }
                    `}
                    onClick={() => {

                        if (isDragging) {
                            return;
                        }

                        handleOffer();

                    }}
                >

                    <Tag size={24} />

                    <span>
                        Offer
                    </span>

                </button>


                {/* =================================================
                    CATEGORIES
                ================================================= */}

                <button
                    className={`
                        bottom-nav-item
                        ${
                            activeTab === "categories"
                                ? "active"
                                : ""
                        }
                    `}
                    onClick={() => {

                        if (isDragging) {
                            return;
                        }

                        handleCategories();

                    }}
                >

                    <LayoutGrid size={24} />

                    <span>
                        Categories
                    </span>

                </button>


                {/* =================================================
                    HOME
                ================================================= */}

                <button
                    className={`
                        bottom-nav-item
                        ${
                            activeTab === "home"
                                ? "active"
                                : ""
                        }
                    `}
                    onClick={() => {

                        if (isDragging) {
                            return;
                        }

                        handleHome();

                    }}
                >

                    <HomeIcon size={24} />

                    <span>
                        Home
                    </span>

                </button>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <button
                    className={`
                        bottom-nav-item
                        ${
                            activeTab === "search"
                                ? "active"
                                : ""
                        }
                    `}
                    onClick={() => {

                        if (isDragging) {
                            return;
                        }

                        handleSearch();

                    }}
                >

                    <Search size={24} />

                    <span>
                        Search
                    </span>

                </button>


                {/* =================================================
                    MORE
                ================================================= */}

                <button
                    className={`
                        bottom-nav-item
                        ${
                            activeTab === "more"
                                ? "active"
                                : ""
                        }
                    `}
                    onClick={() => {

                        if (isDragging) {
                            return;
                        }

                        handleMore();

                    }}
                >

                    <MoreHorizontal size={24} />

                    <span>
                        More
                    </span>

                </button>

            </nav>

        </>
    );
}


export default BottomNav;