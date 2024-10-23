import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import { useSelector } from "react-redux";

const SpecialCase = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-52 right-2 z-20 flex flex-col gap-2">
      {/* Collapsible Button for Mobile Devices */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 bg-white rounded-md shadow-testShadow flex justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6" // Ensure the icon is appropriately sized
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="flex flex-col gap-2 mt-2">
          <Link to="/profile" className="p-2 bg-white text-[#33475b] rounded-md shadow-testShadow">
            <div className="flex items-center">
              <MdSwitchAccount className="mr-2 text-2xl" />
              <span>Profile</span>
            </div>
          </Link>
          <Link to="/cart" className="p-2 bg-white text-[#33475b] rounded-md shadow-testShadow">
            <div className="flex items-center">
              <RiShoppingCart2Fill className="mr-2 text-2xl" />
              <span>Buy Now</span>
              {products.length > 0 && (
                <span className="absolute top-1 right-1 bg-primeColor text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {products.length}
                </span>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Profile and Cart Links for Desktop */}
      <Link to="/profile" className="hidden md:flex">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
          <div className="flex justify-center items-center">
            <MdSwitchAccount className="text-2xl" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Profile</p>
        </div>
      </Link>

      <Link to="/cart" className="hidden md:flex">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
          <div className="flex justify-center items-center">
            <RiShoppingCart2Fill className="text-2xl" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Buy Now</p>
          {products.length > 0 && (
            <p className="absolute top-1 right-2 bg-primeColor text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
              {products.length}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SpecialCase;
