import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Color = () => {
  const [showColors, setShowColors] = useState(true);
  const colors = [
    {
      _id: 9001,
      title: "Black",
      base: "#000000",
    },
    {
      _id: 9002,
      title: "White",
      base: "#FFFFFF",
    },
    {
      _id: 9003,
      title: "Red",
      base: "#EF4444",
    },
    {
      _id: 9004,
      title: "Blue",
      base: "#3B82F6",
    },
    {
      _id: 9005,
      title: "Green",
      base: "#10B981",
    },
    {
      _id: 9006,
      title: "Pink",
      base: "#EC4899",
    },
    {
      _id: 9007,
      title: "Purple",
      base: "#8B5CF6",
    },
    {
      _id: 9008,
      title: "Yellow",
      base: "#F59E0B",
    },
    {
      _id: 9009,
      title: "Orange",
      base: "#F97316",
    },
    {
      _id: 9010,
      title: "Brown",
      base: "#92400E",
    },
    {
      _id: 9011,
      title: "Gray",
      base: "#6B7280",
    },
    {
      _id: 9012,
      title: "Navy",
      base: "#1E3A8A",
    },
  ];

  return (
    <div>
      <div
        onClick={() => setShowColors(!showColors)}
        className="cursor-pointer"
      >
        <NavTitle title="Shop by Color" icons={true} />
      </div>
      {showColors && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {colors.map((item) => (
              <li
                key={item._id}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2"
              >
                <span
                  style={{ 
                    background: item.base,
                    border: item.title === 'White' ? '1px solid #D1D5DB' : 'none'
                  }}
                  className={`w-3 h-3 rounded-full`}
                ></span>
                {item.title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Color;
