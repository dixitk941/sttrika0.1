import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceFilter = (priceRange) => {
    setSelectedPriceRange(priceRange);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange(null);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      
      {/* Filter Status and Clear Button */}
      {(selectedCategory !== "all" || selectedPriceRange) && (
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory !== "all" && (
              <span className="px-3 py-1 bg-primeColor text-white text-sm rounded-full">
                {selectedCategory}
              </span>
            )}
            {selectedPriceRange && (
              <span className="px-3 py-1 bg-primeColor text-white text-sm rounded-full">
                ₹{selectedPriceRange.min.toLocaleString()} - ₹{selectedPriceRange.max.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-primeColor border border-primeColor rounded-lg hover:bg-primeColor hover:text-white transition-colors duration-300"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            onPriceFilter={handlePriceFilter}
            selectedPriceRange={selectedPriceRange}
          />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
          <Pagination 
            itemsPerPage={itemsPerPage} 
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
          />
        </div>
      </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
