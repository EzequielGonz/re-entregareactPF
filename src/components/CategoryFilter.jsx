import React from "react";

function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="category-filter">
      <button
        className={`category-filter-btn${selected === "" ? " active" : ""}`}
        onClick={() => onSelect("")}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-filter-btn${selected === cat ? " active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;