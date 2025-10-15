import React from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useProductsByBadge } from "../../../hooks/useProducts";

const BestSellers = () => {
  const { products, loading, error } = useProductsByBadge("Best Seller", 4);

  if (loading) {
    return (
      <div className="w-full pb-20">
        <Heading heading="Our Bestsellers" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primeColor"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pb-20">
        <Heading heading="Our Bestsellers" />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading bestsellers</p>
        </div>
      </div>
    );
  }

  // Filter out any potential duplicates based on _id
  const uniqueProducts = products.filter((product, index, self) => 
    index === self.findIndex(p => p._id === product._id)
  );

  return (
    <div className="w-full pb-20">
      <Heading heading="Our Bestsellers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {uniqueProducts.map((product) => (
          <Product
            key={product._id}
            _id={product._id}
            img={product.image}
            productName={product.productName || product.name}
            price={product.price}
            color={product.color}
            badge={product.badge}
            des={product.des || product.description}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
