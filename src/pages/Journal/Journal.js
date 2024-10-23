import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Journal = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  
  useEffect(() => {
    setPrevLocation(location.state?.data || "Home");
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4 py-12">
      <Breadcrumbs title="Journals" prevLocation={prevLocation} />
      
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-primeColor tracking-widest uppercase mb-6">
          Sttrika Journals
        </h1>
        <p className="max-w-[700px] mx-auto text-lightText text-lg leading-relaxed">
          Welcome to the future of fashion storytelling. <span className="text-primeColor font-semibold">Sttrika Journals</span> 
          is your gateway to style evolution. Dive deep into trend-setting insights, futuristic designs, 
          and stories that blur the line between fashion and technology. We don’t just create looks; 
          we shape the future of what fashion will become.
        </p>
        <p className="max-w-[700px] mx-auto text-sm text-lightText leading-relaxed opacity-80 mt-6">
          Every journal entry is a glimpse into the future of style — sleek, bold, and crafted for the modern woman. 
          From behind-the-scenes stories to exploring innovations in fabric and design, Sttrika keeps you ahead of the curve.
        </p>

        <Link to="/shop">
          <button className="w-60 h-14 bg-gradient-to-r from-primeColor to-purple-600 text-white hover:bg-black hover:scale-105 transition-all duration-300 ease-in-out uppercase tracking-wide mt-8 shadow-lg transform hover:shadow-xl">
            Discover the Collection
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Journal;
