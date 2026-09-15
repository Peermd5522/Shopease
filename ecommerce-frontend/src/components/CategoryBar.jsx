import "../styles/CategoryBar.css";

function CategoryBar(props) {

    const displayCategories = [
    { label: "Fashion", value: "fashion" },
    { label: "Mobiles", value: "smartphones" },
    { label: "Laptops", value: "laptops" },
    { label: "Cosmetics", value: "beauty" },
    { label: "Fragrances", value: "fragrances" },
    { label: "Furniture", value: "furniture" },
    { label: "Groceries", value: "groceries" },
    ];



  return (

    <div className="category-section">


        <div className="category-bar">

            <button
                className={props.category === "all" ? "active" : ""}
                onClick={() => props.setCategory("all")}
            >
                All
            </button>

            {displayCategories.map((item) => (

                <button
                    key={item.value}
                    className={
                        props.category === item.value
                            ? "active"
                            : ""
                    }
                    onClick={() => props.setCategory(item.value)}
                >
                    {item.label}
                </button>

            ))}

        </div>

        
        <div className="sort-box">
            <select
                value={props.sort}
                onChange={(e) => props.setSort(e.target.value)}
            >
                <option value="">Sort</option>
                <option value="low-high">Price ↑</option>
                <option value="high-low">Price ↓</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="rating.low-high">Rating ↑</option>
                <option value="rating.high-low">Rating ↓</option>
            </select>

        </div>

    </div>
  );
}

export default CategoryBar;