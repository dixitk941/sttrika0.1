import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useProductsByBadge } from "../../../hooks/useProducts";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const { products, loading, error } = useProductsByBadge("New", 8);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
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
      <Slider {...settings}>
        {products.map((product) => (
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
    </div>
  );
};

export default NewArrivals;
