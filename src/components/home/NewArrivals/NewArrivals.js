import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useProductsByBadge } from "../../../hooks/useProducts";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const { products, loading, error } = useProductsByBadge("New", 8);

  // Debug: Log the products to see what we're getting
  console.log("NewArrivals - Raw products:", products);
  console.log("NewArrivals - Product IDs:", products.map(p => ({ id: p._id, name: p.productName || p.name })));

  // Filter out any potential duplicates based on _id
  const uniqueProducts = products.filter((product, index, self) => 
    index === self.findIndex(p => p._id === product._id)
  );

  console.log("NewArrivals - Unique products:", uniqueProducts);
  console.log("NewArrivals - Unique count:", uniqueProducts.length);

  const settings = {
    infinite: uniqueProducts.length > 4, // Only enable infinite scroll if we have more items than visible
    speed: 500,
    slidesToShow: Math.min(4, uniqueProducts.length), // Don't show more slides than products
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: Math.min(3, uniqueProducts.length),
          slidesToScroll: 1,
          infinite: uniqueProducts.length > 3,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: Math.min(2, uniqueProducts.length),
          slidesToScroll: 1,
          infinite: uniqueProducts.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: uniqueProducts.length > 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full pb-16">
        <Heading heading="New Arrivals" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primeColor"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pb-16">
        <Heading heading="New Arrivals" />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading new arrivals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16">
      <Heading heading="New Arrivals" />
      {uniqueProducts.length <= 2 ? (
        // Use grid layout for few products to avoid slider duplication
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
      ) : (
        // Use slider for more products
        <Slider {...settings}>
          {uniqueProducts.map((product) => (
            <div key={product._id} className="px-2">
              <Product
                _id={product._id}
                img={product.image}
                productName={product.productName || product.name}
                price={product.price}
                color={product.color}
                badge={product.badge}
                des={product.des || product.description}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default NewArrivals;
