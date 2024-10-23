import React from "react";
import { MdLocalShipping } from "react-icons/md";
import { CgRedo } from "react-icons/cg";

const BannerBottom = () => {
  return (
    <div className="w-full bg-gradient-to-r from-white to-gray-100 py-4 px-4">
      <div className="max-w-container mx-auto h-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-72 p-4 bg-gradient-to-r from-white to-gray-200 text-black rounded-lg shadow-lg hover:shadow-xl duration-300">
          <span className="font-bold text-2xl">2</span>
          <p className="text-lg">Step Quality Checking</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-72 p-4 bg-gradient-to-r from-white to-gray-200 text-black rounded-lg shadow-lg hover:shadow-xl duration-300">
          <span className="text-3xl">
            <MdLocalShipping />
          </span>
          <p className="text-lg">Free shipping</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-72 p-4 bg-gradient-to-r from-white to-gray-200 text-black rounded-lg shadow-lg hover:shadow-xl duration-300">
          <span className="text-3xl">
            <CgRedo />
          </span>
          <p className="text-lg">Return policy in 10 days</p>
        </div>
      </div>
    </div>
  );
};

export default BannerBottom;