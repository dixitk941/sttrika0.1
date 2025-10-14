import React from "react";
import Category from "./shopBy/Category";
import Price from "./shopBy/Price";

const ShopSideNav = ({ onCategorySelect, selectedCategory, onPriceFilter, selectedPriceRange }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category 
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
      />
      <Price 
        onPriceFilter={onPriceFilter}
        selectedPriceRange={selectedPriceRange}
      />
    </div>
  );
};

export default ShopSideNav;
