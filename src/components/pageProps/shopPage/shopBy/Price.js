import React from "react";
import NavTitle from "./NavTitle";

const Price = ({ onPriceFilter, selectedPriceRange }) => {
  // Updated price ranges for Indian fashion market
  const priceList = [
    {
      _id: 950,
      priceOne: 0,
      priceTwo: 999,
      label: "Under ₹1,000"
    },
    {
      _id: 951,
      priceOne: 1000,
      priceTwo: 2499,
      label: "₹1,000 - ₹2,499"
    },
    {
      _id: 952,
      priceOne: 2500,
      priceTwo: 4999,
      label: "₹2,500 - ₹4,999"
    },
    {
      _id: 953,
      priceOne: 5000,
      priceTwo: 9999,
      label: "₹5,000 - ₹9,999"
    },
    {
      _id: 954,
      priceOne: 10000,
      priceTwo: 19999,
      label: "₹10,000 - ₹19,999"
    },
    {
      _id: 955,
      priceOne: 20000,
      priceTwo: 50000,
      label: "₹20,000 - ₹50,000"
    },
    {
      _id: 956,
      priceOne: 50000,
      priceTwo: 999999,
      label: "Above ₹50,000"
    },
  ];

  const handlePriceClick = (priceRange) => {
    if (onPriceFilter) {
      // If the same price range is clicked again, clear the filter
      if (selectedPriceRange && 
          selectedPriceRange.min === priceRange.min && 
          selectedPriceRange.max === priceRange.max) {
        onPriceFilter(null);
      } else {
        onPriceFilter(priceRange);
      }
    }
  };
  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {/* Clear Price Filter Option */}
          {selectedPriceRange && (
            <li
              onClick={() => onPriceFilter && onPriceFilter(null)}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-red-500 hover:border-red-400 duration-300 cursor-pointer text-red-500 font-medium"
            >
              Clear Price Filter
            </li>
          )}
          
          {/* All Prices Option */}
          <li
            onClick={() => onPriceFilter && onPriceFilter(null)}
            className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer ${
              !selectedPriceRange ? 'text-primeColor font-semibold' : ''
            }`}
          >
            All Prices
          </li>
          
          {priceList.map((item) => (
            <li
              key={item._id}
              onClick={() => handlePriceClick({ min: item.priceOne, max: item.priceTwo })}
              className={`border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300 cursor-pointer ${
                selectedPriceRange && 
                selectedPriceRange.min === item.priceOne && 
                selectedPriceRange.max === item.priceTwo 
                  ? 'text-primeColor font-semibold' 
                  : ''
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
