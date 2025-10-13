import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";

const ItemCard = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-4 hover:shadow-md duration-300 bg-white">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={() => dispatch(deleteItem(item._id))}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
          title="Remove item"
        />
        <div className="flex-shrink-0">
          <img 
            className="w-32 h-32 object-cover border border-gray-200 rounded" 
            src={item.image} 
            alt={item.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/128x128?text=No+Image';
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-titleFont font-semibold text-primeColor">{item.name}</h1>
          {item.colors && (
            <p className="text-sm text-lightText">Color: {item.colors}</p>
          )}
          {item.badge && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded w-fit">
              {item.badge}
            </span>
          )}
          <p className="text-xs text-lightText">SKU: {item._id}</p>
        </div>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          <div className="flex flex-col">
            <span className="text-primeColor">₹{item.price}</span>
            <span className="text-xs text-lightText">per piece</span>
          </div>
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
            className="w-8 h-8 bg-gray-100 text-xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300 rounded"
            title="Decrease quantity"
          >
            -
          </span>
          <p className="font-semibold min-w-[2rem] text-center">{item.quantity}</p>
          <span
            onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
            className="w-8 h-8 bg-gray-100 text-xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300 rounded"
            title="Increase quantity"
          >
            +
          </span>
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg justify-end">
          <div className="flex flex-col text-right">
            <p className="text-primeColor">₹{item.quantity * item.price}</p>
            <p className="text-xs text-lightText">total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
