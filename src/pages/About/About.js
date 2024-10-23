import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const About = () => {
  return (
    <div className="max-w-container mx-auto px-4 py-10 text-center space-y-6">
      <div className="pb-10">
        <h1 className="text-3xl font-bold text-primeColor uppercase tracking-wider mb-4">
          Sttrika
        </h1>
        <p className="max-w-[700px] mx-auto text-base text-lightText leading-relaxed">
          Step into the future of fashion with <span className="font-semibold text-primeColor">Sttrika</span>, where every piece is engineered for the woman of tomorrow. 
          Sleek, bold, and unapologetically powerful, our designs fuse cutting-edge aesthetics with unparalleled comfort. 
          We're not just dressing you for today — we're preparing you to conquer the world of tomorrow.
        </p>
        <p className="max-w-[700px] mx-auto text-base text-lightText mt-4 leading-relaxed">
          Our collections are crafted with innovative fabrics, futuristic cuts, and the finest craftsmanship to elevate your style game. 
          From day to night, work to play, <span className="font-semibold text-primeColor">Sttrika</span> transforms everyday fashion into an experience. 
          Minimalist yet disruptive, we are the future — and so are you.
        </p>
        <p className="max-w-[700px] mx-auto text-sm text-lightText leading-relaxed mt-6 opacity-80">
          Designed for those who don't follow trends but create them.
        </p>
        <Link to="/shop">
          <button className="w-52 h-12 bg-primeColor text-white hover:bg-black hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out mt-8 uppercase tracking-widest">
            Explore the Shop
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
