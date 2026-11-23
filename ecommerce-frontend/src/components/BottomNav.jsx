
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

import { useNavigate } from "react-router-dom";

import "../styles/BottomNav.css";

function BottomNav({
    categories,
    category,
    setCategory,
    search,
    setSearch,
    chatOpen
}) {
    const navigate = useNavigate();


    /* STATE */

    const [activeTab, setActiveTab] = useState("home");
    const [searchOpen, setSearchOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    /* REFS */

    const searchInputRef = useRef(null);
    const navRef = useRef(null);
    const indicatorRef = useRef(null);
    const dragStartRef = useRef(null);
    const didDragRef = useRef(false);

    /* TABS */

    const tabs = [
        "offer",
        "categories",
        "home",
        "search",
        "more"
    ];


    /* SEARCH AUTO FOCUS */

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    /* CLOSE MORE WHEN CLICKING OUTSIDE */

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!moreOpen) return;

            const morePanel = document.querySelector(
                ".bottom-more-panel"
            );

            const bottomNav = navRef.current;

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

    /* SEARCH */

    const handleSearch = () => {
        setMoreOpen(false);
        setActiveTab("search");
        setSearchOpen(true);
    };

    const closeSearch = () => {
        setSearchOpen(false);
        setActiveTab("home");
    };

    /* MORE */

    const handleMore = () => {
        setSearchOpen(false);

        setMoreOpen((previous) => {
            const nextState = !previous;

            setActiveTab(
                nextState ? "more" : "home"
            );

            return nextState;
        });
    };

    /* HOME */

    const handleHome = () => {
        setSearchOpen(false);
        setMoreOpen(false);
        setActiveTab("home");
        navigate("/home");
    };

    /* CATEGORIES */

    const handleCategories = () => {
        setSearchOpen(false);
        setMoreOpen(false);
        setActiveTab("categories");
    };

    /* OFFER */

    const handleOffer = () => {
        setSearchOpen(false);
        setMoreOpen(false);
        setActiveTab("offer");
    };

    /* SELECT TAB */

    const selectTab = (tab) => {
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

    /* GET TAB FROM POINTER */

    const getTabFromPointer = (clientX) => {
        if (!navRef.current) return 0;

        const navRect =
            navRef.current.getBoundingClientRect();

        const padding = 7;

        const usableWidth =
            navRect.width - padding * 2;

        const itemWidth =
            usableWidth / tabs.length;

        const pointerX =
            clientX - navRect.left - padding;

        let index = Math.floor(
            pointerX / itemWidth
        );

        index = Math.max(
            0,
            Math.min(tabs.length - 1, index)
        );

        return index;
    };

    /* DRAG START */

    const handlePointerDown = (event) => {
        if (!navRef.current || !indicatorRef.current) {
            return;
        }

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        dragStartRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            target: event.target,
            startTab: activeTab,
            startedOnButton: Boolean(
                event.target.closest(".bottom-nav-item")
            ),
            dragging: false
        };

        didDragRef.current = false;

        try {
            event.target.setPointerCapture(event.pointerId);
        } catch {
            // Pointer capture unavailable.
        }
    };

    /* DRAG MOVE */

    const handlePointerMove = (event) => {
        const drag = dragStartRef.current;

        if (
            !drag ||
            drag.pointerId !== event.pointerId
        ) {
            return;
        }

        const deltaX = event.clientX - drag.startX;
        const deltaY = event.clientY - drag.startY;

        if (!drag.dragging) {
            if (Math.hypot(deltaX, deltaY) < 6) {
                return;
            }

            drag.dragging = true;

            setIsDragging(true);
            setSearchOpen(false);
            setMoreOpen(false);
        }

        event.preventDefault();

        const navRect =
            navRef.current.getBoundingClientRect();

        const indicator = indicatorRef.current;

        const indicatorWidth =
            indicator.offsetWidth;

        const padding = 7;

        const minX = padding;

        const maxX =
            navRect.width -
            indicatorWidth -
            padding;

        let x =
            event.clientX -
            navRect.left -
            indicatorWidth / 2;

        x = Math.max(
            minX,
            Math.min(maxX, x)
        );

        indicator.style.setProperty(
            "--drag-x",
            `${x - padding}px`
        );

        const glassCenter =
            x + indicatorWidth / 2;

        const usableWidth =
            navRect.width - padding * 2;

        const itemWidth =
            usableWidth / tabs.length;

        let index = Math.floor(
            (glassCenter - padding) / itemWidth
        );

        index = Math.max(
            0,
            Math.min(tabs.length - 1, index)
        );

        setActiveTab(tabs[index]);
    };

    /* DRAG END */

    const handlePointerUp = (event) => {
        const drag = dragStartRef.current;

        if (
            !drag ||
            drag.pointerId !== event.pointerId
        ) {
            return;
        }

        dragStartRef.current = null;

        try {
            drag.target.releasePointerCapture(
                event.pointerId
            );
        } catch {
            // Already released.
        }

        if (!drag.dragging) {
            return;
        }

        if (drag.startedOnButton) {
            didDragRef.current = true;
        }

        const selectedIndex =
            getTabFromPointer(event.clientX);

        const selectedTab = tabs[selectedIndex];

        setIsDragging(false);

        indicatorRef.current?.style.removeProperty(
            "--drag-x"
        );

        selectTab(selectedTab);
    };

    /* DRAG CANCEL */

    const handlePointerCancel = (event) => {
        const drag = dragStartRef.current;

        if (
            !drag ||
            drag.pointerId !== event.pointerId
        ) {
            return;
        }

        dragStartRef.current = null;

        setIsDragging(false);
        setActiveTab(drag.startTab);

        indicatorRef.current?.style.removeProperty(
            "--drag-x"
        );

        try {
            drag.target.releasePointerCapture(
                event.pointerId
            );
        } catch {
            // Already released.
        }
    };

    /* CATEGORY SELECTION */

    const handleCategorySelect = (value) => {
        setCategory(value);
        setMoreOpen(false);
        setActiveTab("home");
    };

    /* RENDER */

    return (
        <div
            className={`bottom-nav-wrapper ${
                chatOpen ? "bottom-nav-wrapper-hidden" : ""
            }`}
        >

            {/* CATEGORY PANEL */}

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
                        <h3>Categories</h3>
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
                            category === "all" ? "active" : ""
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
                                category === item ? "active" : ""
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

            {/* MORE PANEL */}

            <div
                className={`
                    bottom-more-panel
                    ${moreOpen ? "more-panel-open" : ""}
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
                    <span>Cart</span>
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
                    <span>Wishlist</span>
                </button>
            </div>

            {/* SEARCH BAR */}

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
                        setSearch(event.target.value)
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

            {/* BOTTOM NAVIGATION */}

            <nav
                ref={navRef}
                className={`bottom-nav ${
                    isDragging ? "nav-dragging" : ""
                }`}
                data-active={activeTab}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onClickCapture={(event) => {
                    if (didDragRef.current) {
                        event.preventDefault();
                        event.stopPropagation();
                        didDragRef.current = false;
                    }
                }}
            >

                {/* LIQUID GLASS INDICATOR */}

                <div
                    ref={indicatorRef}
                    className="bottom-nav-indicator"
                    aria-hidden="true"
                />

                {/* OFFER */}

                <button
                    className={`bottom-nav-item ${
                        activeTab === "offer" ? "active" : ""
                    }`}
                    onClick={() => handleOffer()}
                >
                    <Tag size={24} />
                    <span>Offer</span>
                </button>

                {/* CATEGORIES */}

                <button
                    className={`bottom-nav-item ${
                        activeTab === "categories" ? "active" : ""
                    }`}
                    onClick={() => handleCategories()}
                >
                    <LayoutGrid size={24} />
                    <span>Categories</span>
                </button>

                {/* HOME */}

                <button
                    className={`bottom-nav-item ${
                        activeTab === "home" ? "active" : ""
                    }`}
                    onClick={() => handleHome()}
                >
                    <HomeIcon size={24} />
                    <span>Home</span>
                </button>

                {/* SEARCH */}

                <button
                    className={`bottom-nav-item ${
                        activeTab === "search" ? "active" : ""
                    }`}
                    onClick={() => handleSearch()}
                >
                    <Search size={24} />
                    <span>Search</span>
                </button>

                {/* MORE */}

                <button
                    className={`bottom-nav-item ${
                        activeTab === "more" ? "active" : ""
                    }`}
                    onClick={() => handleMore()}
                >
                    <MoreHorizontal size={24} />
                    <span>More</span>
                </button>

            </nav>
        </div>
    );
}

export default BottomNav;
