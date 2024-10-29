import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import { logoLight } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";

const BottomNavBar = () => (
  <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-50 md:hidden">
    <NavLink to="/" className="flex flex-col items-center text-gray-600 hover:text-black">
      <AiOutlineHome size={24} />
      <span className="text-xs">Home</span>
    </NavLink>
    <NavLink to="/shop" className="flex flex-col items-center text-gray-600 hover:text-black">
      <FaStore size={24} />
      <span className="text-xs">Shop</span>
    </NavLink>
    <NavLink to="/cart" className="flex flex-col items-center text-gray-600 hover:text-black">
      <AiOutlineShoppingCart size={24} />
      <span className="text-xs">Cart</span>
    </NavLink>
    <NavLink to="/profile" className="flex flex-col items-center text-gray-600 hover:text-black">
      <AiOutlineUser size={24} />
      <span className="text-xs">Profile</span>
    </NavLink>
  </div>
);

const Header = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);
    return () => window.removeEventListener("resize", ResponsiveMenu);
  }, []);

  return (
    <>
      <div className="w-full h-20 bg-white sticky top-0 z-50 border-b-[1px] border-b-gray-200">
        <nav className="h-full px-4 max-w-container mx-auto relative">
          <Flex className="flex items-center justify-between h-full">
            <Link to="/">
              <Image className="w-64 object-cover" imgSrc={logoLight} />
            </Link>
            <div>
              {showMenu && (
                <motion.ul
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center w-auto z-50 p-0 gap-2"
                >
                  {navBarList.map(({ _id, title, link }) => (
                    <NavLink
                      key={_id}
                      className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                      to={link}
                      state={{ data: location.pathname.split("/")[1] }}
                    >
                      <li>{title}</li>
                    </NavLink>
                  ))}
                </motion.ul>
              )}
              <HiMenuAlt2
                onClick={() => setSidenav(!sidenav)}
                className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4"
              />
              {sidenav && (
                <div className="fixed top-0 left-0 w-full h-screen bg-black text-gray-200 bg-opacity-80 z-50">
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-[80%] h-full relative"
                  >
                    <div className="w-full h-full bg-primeColor p-6">
                      <Link to="/" className="flex flex-col items-center text-center">
                        <span className="text-3xl font-bold tracking-wide text-white" style={{ fontFamily: 'Times New Roman, serif' }}>
                          Sttrika
                        </span>
                        <p className="text-lg font- text-white mt-2" style={{ fontFamily: 'Times New Roman, serif' }}>
                          Style Meets Comfort
                        </p>
                        <div className="border-b-4 border-white w-1/2 mt-1"></div>
                      </Link>
                      <br /><br />
                      <ul className="text-gray-200 flex flex-col gap-2">
                        {navBarList.map((item) => (
                          <li
                            className="font-normal hover:font-bold items-center text-lg text-gray-200 hover:underline underline-offset-[4px] decoration-[1px] hover:text-white md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                            key={item._id}
                          >
                            <NavLink
                              to={item.link}
                              state={{ data: location.pathname.split("/")[1] }}
                              onClick={() => setSidenav(false)}
                            >
                              {item.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                      {/* Category and Brand dropdowns */}
                    </div>
                    <span
                      onClick={() => setSidenav(false)}
                      className="w-8 h-8 border-[1px] border-gray-300 absolute top-2 -right-10 text-gray-300 text-2xl flex justify-center items-center cursor-pointer hover:border-red-500 hover:text-red-500 duration-300"
                    >
                      <MdClose />
                    </span>
                  </motion.div>
                </div>
              )}
            </div>
          </Flex>
        </nav>
      </div>
      {/* Only show BottomNavBar on mobile view */}
      <BottomNavBar />
    </>
  );
};

export default Header;
