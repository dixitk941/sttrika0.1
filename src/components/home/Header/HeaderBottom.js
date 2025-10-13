import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../../constants";
import { auth, onAuthStateChanged, signOut } from "../../../config/firebase";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [showUser, setShowUser] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUser(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUser(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearchItemClick = (item) => {
    navigate(
      `/product/${item.productName.toLowerCase().split("").join("")}`,
      { state: { item: item } }
    );
    setSearchQuery("");
    setShowSearchResults(false);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = paginationItems.filter((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  return (
    <div className="w-full bg-white border-b border-gray-200 relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-center justify-between w-full px-4 py-4 gap-4 lg:gap-8">
          
          {/* Enhanced Search Bar */}
          <div className="relative w-full lg:w-[600px] order-2 lg:order-1">
            <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden hover:border-primeColor focus-within:border-primeColor transition-colors duration-300">
              <input
                className="flex-1 h-12 px-4 outline-none text-primeColor placeholder:text-lightText bg-transparent"
                type="text"
                onChange={handleSearch}
                value={searchQuery}
                placeholder="Search for products, brands, categories..."
                onFocus={() => setShowSearchResults(searchQuery.length > 0)}
              />
              <div className="px-4 text-lightText hover:text-primeColor cursor-pointer transition-colors duration-300">
                <FaSearch className="w-5 h-5" />
              </div>
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery && showSearchResults && (
              <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm text-lightText">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    {filteredProducts.slice(0, 8).map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSearchItemClick(item)}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                      >
                        <img 
                          className="w-16 h-16 object-cover rounded border border-gray-200" 
                          src={item.img} 
                          alt={item.productName}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-titleFont font-medium text-primeColor truncate">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-lightText truncate">
                            {item.des}
                          </p>
                          <p className="text-sm font-semibold text-primeColor mt-1">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length > 8 && (
                      <div className="px-4 py-3 bg-gray-50 text-center">
                        <p className="text-sm text-lightText">
                          +{filteredProducts.length - 8} more results. Keep typing to refine your search.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-lightText">No products found for "{searchQuery}"</p>
                    <p className="text-sm text-lightText mt-1">Try different keywords or browse our categories</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile & Cart Section */}
          <div className="flex items-center gap-6 order-1 lg:order-2">
            
            {/* Dynamic User Profile Dropdown */}
            <div className="relative" ref={userRef}>
              <div 
                onClick={() => setShowUser(!showUser)} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-300 group"
              >
                <div className="w-8 h-8 bg-primeColor text-white rounded-full flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                  <FaUser className="w-4 h-4" />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-xs text-lightText">
                    {user ? 'Welcome back' : 'Hello, Guest'}
                  </span>
                  <span className="text-sm font-medium text-primeColor">
                    {user ? (user.displayName || user.email?.split('@')[0] || 'User') : 'Sign In'}
                  </span>
                </div>
                <FaCaretDown className="text-lightText group-hover:text-primeColor transition-colors duration-300" />
              </div>
              
              {showUser && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-48 py-2"
                >
                  {user ? (
                    // Logged in user menu
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-primeColor truncate">
                          {user.displayName || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-lightText truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link to="/profile" onClick={() => setShowUser(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                          <FaUser className="w-4 h-4 text-lightText" />
                          <span className="text-primeColor">My Profile</span>
                        </div>
                      </Link>
                      
                      <Link to="/profile" onClick={() => setShowUser(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                          <FaShoppingCart className="w-4 h-4 text-lightText" />
                          <span className="text-primeColor">My Orders</span>
                        </div>
                      </Link>
                      
                      <hr className="my-2" />
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 text-left"
                      >
                        <FaSignOutAlt className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    // Guest user menu
                    <>
                      <Link to="/signin" onClick={() => setShowUser(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                          <FaSignInAlt className="w-4 h-4 text-lightText" />
                          <span className="text-primeColor">Sign In</span>
                        </div>
                      </Link>
                      
                      <Link to="/signup" onClick={() => setShowUser(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                          <FaUserPlus className="w-4 h-4 text-lightText" />
                          <span className="text-primeColor">Create Account</span>
                        </div>
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Shopping Cart */}
            <Link to="/cart">
              <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 group">
                <div className="relative">
                  <FaShoppingCart className="w-6 h-6 text-primeColor group-hover:text-black transition-colors duration-300" />
                  {products.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {products.length > 99 ? '99+' : products.length}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-xs text-lightText">Your Cart</span>
                  <span className="text-sm font-medium text-primeColor">
                    {products.length} item{products.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;