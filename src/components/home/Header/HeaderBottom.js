import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../../constants";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  return (
    <div className="w-full bg-gradient-to-r from-white to-gray-300 relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-2 text-black"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Shop by Category</p>

            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-36 z-50 bg-white text-black w-auto h-auto p-4 pb-6 shadow-lg rounded-lg"
              >
                {["Accessories", "Furniture", "Electronics", "Clothes", "Bags", "Home appliances"].map((category) => (
                  <li
                    key={category}
                    className="text-black px-4 py-1 border-b-[1px] border-b-gray-300 hover:border-b-black hover:text-black duration-300 cursor-pointer"
                  >
                    {category}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-black bg-white flex items-center gap-2 justify-between px-6 rounded-xl shadow-lg">
            <input
              className="flex-1 h-full outline-none text-black placeholder:text-gray-400 placeholder:text-[14px] rounded-l-xl px-4"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search your products here"
            />
            <FaSearch className="w-5 h-5 text-gray-400" />
            {searchQuery && (
              <div
                className={`w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl rounded-lg`}
              >
                {searchQuery &&
                  filteredProducts.map((item) => (
                    <div
                      onClick={() =>
                        navigate(
                          `/product/${item.productName
                            .toLowerCase()
                            .split(" ")
                            .join("")}`,
                          {
                            state: {
                              item: item,
                            },
                          }
                        ) &
                        setShowSearchBar(true) &
                        setSearchQuery("")
                      }
                      key={item._id}
                      className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3 p-4 rounded-lg shadow-md"
                    >
                      <img className="w-24 rounded-lg" src={item.img} alt="productImg" />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-lg text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-600">{item.des}</p>
                        <p className="text-sm text-gray-800">
                          Price:{" "}
                          <span className="text-blue-500 font-semibold">
                            ₹{item.price}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 lg:mt-0 pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex text-black items-center gap-1">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-white text-black w-44 h-auto p-4 pb-6 shadow-lg rounded-lg"
              >
                <Link to="/signin">
                  <li className="text-black px-4 py-1 border-b-[1px] border-b-gray-300 hover:border-b-black hover:text-black duration-300 cursor-pointer">
                    Login
                  </li>
                </Link>
                <Link onClick={() => setShowUser(false)} to="/signup">
                  <li className="text-black px-4 py-1 border-b-[1px] border-b-gray-300 hover:border-b-black hover:text-black duration-300 cursor-pointer">
                    Sign Up
                  </li>
                </Link>
                <li className="text-black px-4 py-1 border-b-[1px] border-b-gray-300 hover:border-b-black hover:text-black duration-300 cursor-pointer">
                    <Link to="/profile" className="block w-full h-full">
                        Profile
                    </Link>
                </li>
                <li className="text-black px-4 py-1 border-b-[1px] border-b-gray-300 hover:border-b-black hover:text-black duration-300 cursor-pointer">
                  Others
                </li>
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative text-black">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-black text-white">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;