import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaTimes, FaSearch, FaUser, FaCaretDown, FaShoppingCart, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBell } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { FaStore } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logoLight } from "../../../assets/images/index";
import Image from "../../designLayouts/Image";
import { navBarList, paginationItems } from "../../../constants";
import { auth, onAuthStateChanged, signOut } from "../../../config/firebase";

const Header = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const userRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUser(false);
      }
    };
    
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowMobileSearch(false);
        setSearchQuery("");
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyPress);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [ref, userRef]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile search is active
  useEffect(() => {
    if (showMobileSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileSearch]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
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

  const getNavIcon = (title) => {
    switch (title) {
      case "Home":
        return <AiOutlineHome className="w-5 h-5" />;
      case "Shop":
        return <FaStore className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Main Header */}
      <header 
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Search Bar - Full Width when Active */}
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute inset-x-4 top-1/2 transform -translate-y-1/2 z-10"
            >
                <div className="relative flex items-center bg-white border-2 border-[#262626] rounded-lg overflow-hidden shadow-lg">
                  <input
                    className="flex-1 h-12 px-4 outline-none text-[#262626] placeholder:text-[#6D6D6D] bg-white"
                    type="text"
                    onChange={handleSearch}
                    value={searchQuery}
                    placeholder="Search for products..."
                    onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowMobileSearch(false);
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="px-4 text-[#6D6D6D] hover:text-[#262626] transition-colors duration-300"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Mobile Search Results Dropdown */}
                {searchQuery && showSearchResults && (
                  <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                          <p className="text-sm text-[#6D6D6D]">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                          </p>
                        </div>
                        {filteredProducts.slice(0, 6).map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              handleSearchItemClick(item);
                              setShowMobileSearch(false);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                          >
                            <img 
                              className="w-12 h-12 object-cover rounded border border-gray-200" 
                              src={item.img} 
                              alt={item.productName}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#262626] truncate text-sm">
                                {item.productName}
                              </h3>
                              <p className="text-xs text-[#6D6D6D] truncate">
                                ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                        {filteredProducts.length > 6 && (
                          <div className="px-4 py-2 bg-gray-50 text-center">
                            <p className="text-xs text-[#6D6D6D]">
                              +{filteredProducts.length - 6} more results
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-[#6D6D6D] text-sm">No products found</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Mobile Layout: Logo, Search and Notifications */}
            <div className="lg:hidden flex items-center justify-between w-full h-16 px-4">
              
              {/* Logo */}
              <Link to="/" className={`flex-shrink-0 transition-opacity duration-200 ${showMobileSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image 
                    className="h-10 w-auto object-contain" 
                    imgSrc={logoLight} 
                  />
                </motion.div>
              </Link>
              
              {/* Search Bar (Always Visible) */}
              <div className={`flex-1 mx-4 transition-opacity duration-200 ${showMobileSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100/80 hover:bg-gray-200/80 rounded-full transition-all duration-200 border border-gray-200"
                  aria-label="Search"
                >
                  <FaSearch className="w-4 h-4 text-[#6D6D6D] flex-shrink-0" />
                  <span className="text-sm text-[#6D6D6D] font-medium truncate">Search products...</span>
                </button>
              </div>

              {/* Notifications Icon */}
              <div className={`flex items-center gap-2 transition-opacity duration-200 ${showMobileSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <Link to="/notifications">
                  <div className="relative p-2.5 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-colors duration-200">
                    <FaBell className="w-5 h-5 text-[#6D6D6D]" />
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      3
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between w-full gap-8">
              {/* Desktop Logo */}
              <Link to="/" className="flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <Image 
                    className="h-14 w-auto object-contain" 
                    imgSrc={logoLight} 
                  />
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="flex items-center space-x-1">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-1"
              >
                {navBarList.map(({ _id, title, link }) => (
                  <NavLink
                    key={_id}
                    to={link}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                        isActive
                          ? 'text-[#262626] bg-gray-50'
                          : 'text-[#6D6D6D] hover:text-[#262626] hover:bg-gray-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="relative z-10">{title}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gray-100 rounded-lg"
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#262626] transition-all duration-200 ${
                          isActive ? 'w-6' : 'group-hover:w-4'
                        }`} />
                      </>
                    )}
                  </NavLink>
                ))}
              </motion.div>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="relative hidden lg:block flex-1 max-w-2xl mx-8">
              <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden hover:border-[#262626] focus-within:border-[#262626] transition-colors duration-300">
                <input
                  className="flex-1 h-10 px-4 outline-none text-[#262626] placeholder:text-[#6D6D6D] bg-transparent"
                  type="text"
                  onChange={handleSearch}
                  value={searchQuery}
                  placeholder="Search for products, brands, categories..."
                  onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                />
                <div className="px-4 text-[#6D6D6D] hover:text-[#262626] cursor-pointer transition-colors duration-300">
                  <FaSearch className="w-4 h-4" />
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery && showSearchResults && (
                <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    <>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm text-[#6D6D6D]">
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
                            <h3 className="font-titleFont font-medium text-[#262626] truncate">
                              {item.productName}
                            </h3>
                            <p className="text-sm text-[#6D6D6D] truncate">
                              {item.des}
                            </p>
                            <p className="text-sm font-semibold text-[#262626] mt-1">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {filteredProducts.length > 8 && (
                        <div className="px-4 py-3 bg-gray-50 text-center">
                          <p className="text-sm text-[#6D6D6D]">
                            +{filteredProducts.length - 8} more results. Keep typing to refine your search.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-[#6D6D6D]">No products found for "{searchQuery}"</p>
                      <p className="text-sm text-[#6D6D6D] mt-1">Try different keywords or browse our categories</p>
                    </div>
                  )}
                </div>
              )}
            </div>



            {/* Notifications, User Profile & Cart Section - Hidden on mobile, visible on desktop */}
            <div className={`hidden lg:flex items-center gap-4 transition-opacity duration-200 ${showMobileSearch ? 'lg:opacity-100 opacity-0 pointer-events-none lg:pointer-events-auto' : 'opacity-100'}`}>
              
              {/* Desktop Notifications */}
              <Link to="/notifications">
                <div className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 group">
                  <FaBell className="w-6 h-6 text-[#6D6D6D] group-hover:text-[#262626] transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </div>
              </Link>
              
              {/* Dynamic User Profile Dropdown */}
              <div className="relative" ref={userRef}>
                <div 
                  onClick={() => setShowUser(!showUser)} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 bg-[#262626] text-white rounded-full flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs text-[#6D6D6D]">
                      {user ? 'Welcome back' : 'Hello, Guest'}
                    </span>
                    <span className="text-sm font-medium text-[#262626]">
                      {user ? (user.displayName || user.email?.split('@')[0] || 'User') : 'Sign In'}
                    </span>
                  </div>
                  <FaCaretDown className="text-[#6D6D6D] group-hover:text-[#262626] transition-colors duration-300" />
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
                          <p className="font-medium text-[#262626] truncate">
                            {user.displayName || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs text-[#6D6D6D] truncate">
                            {user.email}
                          </p>
                        </div>
                        
                        <Link to="/profile" onClick={() => setShowUser(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                            <FaUser className="w-4 h-4 text-[#6D6D6D]" />
                            <span className="text-[#262626]">My Profile</span>
                          </div>
                        </Link>
                        
                        <Link to="/profile" onClick={() => setShowUser(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                            <FaShoppingCart className="w-4 h-4 text-[#6D6D6D]" />
                            <span className="text-[#262626]">My Orders</span>
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
                            <FaSignInAlt className="w-4 h-4 text-[#6D6D6D]" />
                            <span className="text-[#262626]">Sign In</span>
                          </div>
                        </Link>
                        
                        <Link to="/signup" onClick={() => setShowUser(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200">
                            <FaUserPlus className="w-4 h-4 text-[#6D6D6D]" />
                            <span className="text-[#262626]">Create Account</span>
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
                    <FaShoppingCart className="w-6 h-6 text-[#262626] group-hover:text-black transition-colors duration-300" />
                    {products.length > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {products.length > 99 ? '99+' : products.length}
                      </span>
                    )}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs text-[#6D6D6D]">Your Cart</span>
                    <span className="text-sm font-medium text-[#262626]">
                      {products.length} item{products.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button - Hidden on mobile since bottom nav exists */}
            <div className="hidden" ref={ref}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-[#6D6D6D] hover:text-[#262626] hover:bg-gray-50 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {showMenu ? (
                  <FaTimes className="w-5 h-5" />
                ) : (
                  <HiOutlineMenuAlt4 className="w-6 h-6" />
                )}
              </button>

              {/* Mobile Menu */}
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  
                  {/* Menu Panel */}
                  <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex flex-col h-full">
                      {/* Menu Header */}
                      <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Image className="h-8 w-auto" imgSrc={logoLight} />
                          <span className="text-lg font-semibold text-[#262626]">Menu</span>
                        </div>
                        <button
                          onClick={() => setShowMenu(false)}
                          className="p-2 rounded-lg text-[#6D6D6D] hover:text-[#262626] hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FaTimes className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Mobile Search */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden hover:border-[#262626] focus-within:border-[#262626] transition-colors duration-300">
                          <input
                            className="flex-1 h-10 px-4 outline-none text-[#262626] placeholder:text-[#6D6D6D] bg-transparent"
                            type="text"
                            onChange={handleSearch}
                            value={searchQuery}
                            placeholder="Search products..."
                            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                          />
                          <div className="px-4 text-[#6D6D6D] hover:text-[#262626] cursor-pointer transition-colors duration-300">
                            <FaSearch className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <nav className="flex-1 py-6">
                        <motion.ul
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="space-y-2 px-6"
                        >
                          {navBarList.map(({ _id, title, link }, index) => (
                            <motion.li
                              key={_id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <NavLink
                                to={link}
                                onClick={() => setShowMenu(false)}
                                className={({ isActive }) =>
                                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                                    isActive
                                      ? 'text-[#262626] bg-gray-100'
                                      : 'text-[#6D6D6D] hover:text-[#262626] hover:bg-gray-50'
                                  }`
                                }
                              >
                                {getNavIcon(title)}
                                <span>{title}</span>
                              </NavLink>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </nav>

                      {/* Menu Footer */}
                      <div className="p-6 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-sm text-[#6D6D6D]">
                            Discover amazing products
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 gap-1 py-2">
          {navBarList.map(({ _id, title, link }) => (
            <NavLink
              key={_id}
              to={link}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors duration-200 ${
                  isActive
                    ? 'text-[#262626]'
                    : 'text-[#6D6D6D] hover:text-[#262626]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`mb-1 transition-all duration-200 ${
                    isActive ? 'text-[#262626]' : 'text-[#6D6D6D]'
                  }`}>
                    {getNavIcon(title)}
                  </div>
                  <span className="font-medium">{title}</span>
                  <div className={`w-6 h-0.5 rounded-full mt-1 transition-all duration-200 ${
                    isActive ? 'bg-[#262626]' : 'bg-transparent'
                  }`} />
                </>
              )}
            </NavLink>
          ))}
          
          {/* Notifications Bottom Nav Item */}
          <NavLink 
            to="/notifications" 
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors duration-200 ${
                isActive
                  ? 'text-[#262626]'
                  : 'text-[#6D6D6D] hover:text-[#262626]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative mb-1 transition-all duration-200 ${
                  isActive ? 'text-[#262626]' : 'text-[#6D6D6D]'
                }`}>
                  <FaBell className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </div>
                <span className="font-medium">Alerts</span>
                <div className={`w-6 h-0.5 rounded-full mt-1 transition-all duration-200 ${
                  isActive ? 'bg-[#262626]' : 'bg-transparent'
                }`} />
              </>
            )}
          </NavLink>
          
          {/* Cart Bottom Nav Item */}
          <NavLink 
            to="/cart" 
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors duration-200 ${
                isActive
                  ? 'text-[#262626]'
                  : 'text-[#6D6D6D] hover:text-[#262626]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative mb-1 transition-all duration-200 ${
                  isActive ? 'text-[#262626]' : 'text-[#6D6D6D]'
                }`}>
                  <FaShoppingCart className="w-5 h-5" />
                  {products.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {products.length > 9 ? '9+' : products.length}
                    </span>
                  )}
                </div>
                <span className="font-medium">Cart</span>
                <div className={`w-6 h-0.5 rounded-full mt-1 transition-all duration-200 ${
                  isActive ? 'bg-[#262626]' : 'bg-transparent'
                }`} />
              </>
            )}
          </NavLink>
          
          {/* Profile Bottom Nav Item */}
          <NavLink 
            to="/profile" 
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors duration-200 ${
                isActive
                  ? 'text-[#262626]'
                  : 'text-[#6D6D6D] hover:text-[#262626]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`mb-1 transition-all duration-200 ${
                  isActive ? 'text-[#262626]' : 'text-[#6D6D6D]'
                }`}>
                  <FaUser className="w-5 h-5" />
                </div>
                <span className="font-medium">Profile</span>
                <div className={`w-6 h-0.5 rounded-full mt-1 transition-all duration-200 ${
                  isActive ? 'bg-[#262626]' : 'bg-transparent'
                }`} />
              </>
            )}
          </NavLink>
        </div>
      </div>

    </>
  );
};

export default Header;
