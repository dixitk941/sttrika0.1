import React from "react";
import { AiOutlineCopyright } from "react-icons/ai";
import './FooterBottom.css'; // Assuming you have a CSS file for additional styles

const FooterBottom = () => {
  return (
    <div className="w-full bg-gradient-to-r from-white to-gray-200 text-black py-6">
      <div className="max-w-container mx-auto border-t-[1px] border-gray-400 pt-10 pb-20">
        <p className="text-titleFont font-normal text-center flex md:items-center justify-center text-gray-700 duration-200 text-sm">
          <span className="text-md mr-[1px] mt-[2px] md:mt-0 text-center hidden md:inline-flex">
            <AiOutlineCopyright />
          </span>
          Copyright 2024 | Sttrika shopping | All Rights Reserved |
          <a href="https://neocodenex.tech/" target="_blank" rel="noreferrer" className="hover-link">
            <span className="ml-1 font-medium transition-colors duration-300">
              Powered by dixitk941 & Neocodenex
            </span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;