import React, { useEffect, useCallback } from "react";
import NavTitle from "./NavTitle";
import { useAvailableCategories } from "../../../../hooks/useProducts";

const Category = ({ onCategorySelect, selectedCategory }) => {
  // Fetch only categories that have products
  const { categories, loading, error } = useAvailableCategories();
  const handleCategoryClick = useCallback((categoryValue) => {
    if (onCategorySelect) {
      onCategorySelect(categoryValue);
    }
  }, [onCategorySelect]);

  // Check if the currently selected category still exists in available categories
  const isSelectedCategoryAvailable = categories.some(cat => cat.value === selectedCategory);
  
  // If selected category is no longer available (products deleted), auto-select "All Products"
  useEffect(() => {
    if (!loading && !isSelectedCategoryAvailable && selectedCategory !== "all" && categories.length > 0) {
      handleCategoryClick("all");
    }
  }, [loading, isSelectedCategoryAvailable, selectedCategory, categories.length, handleCategoryClick]);

  if (loading) {
    return (
      <div className="w-full">
        <NavTitle title="Shop by Category" icons={false} />
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primeColor"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <NavTitle title="Shop by Category" icons={false} />
        <div className="text-red-500 text-sm py-4">
          Error loading categories
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        {categories.length === 0 ? (
          <div className="text-gray-500 text-sm py-4">
            No categories available
          </div>
        ) : (
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {categories.map(({ _id, title, value, count }) => (
              <li
                key={_id}
                onClick={() => handleCategoryClick(value)}
                className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between cursor-pointer hover:text-primeColor duration-300 ${
                  selectedCategory === value ? 'text-primeColor font-semibold' : ''
                }`}
              >
                <span>{title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === value 
                    ? 'bg-primeColor text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Category;
