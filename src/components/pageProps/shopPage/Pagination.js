import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import { useProducts, useProductsByCategory } from "../../../hooks/useProducts";
function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id} className="w-full">
            <Product
              _id={item._id}
              img={item.img}
              productName={item.productName}
              price={item.price}
              color={item.color}
              badge={item.badge}
              des={item.des}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, selectedCategory = "all", selectedPriceRange = null }) => {
  // Fetch products from Firestore
  const { products: allProducts, loading: allLoading, error: allError } = useProducts();
  const { products: categoryProducts, loading: categoryLoading, error: categoryError } = useProductsByCategory(selectedCategory);
  
  // Use appropriate data based on selected category
  let items = selectedCategory === "all" ? allProducts : categoryProducts;
  const loading = selectedCategory === "all" ? allLoading : categoryLoading;
  const error = selectedCategory === "all" ? allError : categoryError;

  // Apply price filtering if selected
  if (selectedPriceRange && items.length > 0) {
    items = items.filter(product => {
      const price = parseFloat(product.price);
      return price >= selectedPriceRange.min && price <= selectedPriceRange.max;
    });
  }
  
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  //   console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primeColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset},`
    // );
    setItemStart(newOffset);
  };

  return (
    <div>
      {/* Products Count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {items.length} product{items.length !== 1 ? 's' : ''}
        {selectedCategory !== "all" && ` in ${selectedCategory}`}
        {selectedPriceRange && ` (₹${selectedPriceRange.min.toLocaleString()} - ₹${selectedPriceRange.max.toLocaleString()})`}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl text-gray-300 mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500 text-center">
            Try adjusting your filters or browse all products
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
          <Items currentItems={currentItems} />
        </div>
      )}
      {items.length > 0 && (
        <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
          {pageCount > 1 && (
            <ReactPaginate
              nextLabel=""
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel=""
              pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
              pageClassName="mr-6"
              containerClassName="flex text-base font-semibold font-titleFont py-10"
              activeClassName="bg-black text-white"
            />
          )}

          <p className="text-base font-normal text-lightText">
            Products from {itemStart === 0 ? 1 : itemStart} to {Math.min(endOffset, items.length)} of{" "}
            {items.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default Pagination;
