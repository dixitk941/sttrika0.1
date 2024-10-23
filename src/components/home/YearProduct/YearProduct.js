import React from "react";
import { Link } from "react-router-dom";
import { productOfTheYear } from "../../../assets/images";
import ShopNow from "../../designLayouts/buttons/ShopNow";
import Image from "../../designLayouts/Image";

const YearProduct = () => {
  return (
    <Link to="/shop">
      <div className="relative w-full h-80 mb-20 bg-[#f3f3f3] md:bg-transparent overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 font-titleFont">
        <Image
          className="w-full h-full object-cover hidden md:inline-block"
          imgSrc={productOfTheYear}
        />
        <div className="absolute top-0 right-0 w-full md:w-2/3 xl:w-1/2 h-full p-4 md:p-6 flex flex-col justify-center bg-gradient-to-r from-black/60 to-transparent rounded-lg">
          <h1 className="text-4xl font-extrabold text-white transition duration-200 hover:text-yellow-300">
            Product of the Year
          </h1>
          <p className="text-lg font-light text-white mt-2 max-w-md">
            Discover the elegance and style of our latest collection that redefines fashion. Join us on this journey of inspiration and creativity.
          </p>
          <ShopNow />
        </div>
      </div>
    </Link>
  );
};

export default YearProduct;
