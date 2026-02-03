"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const wallpapers = [
  "/images/wallpaper1.jpeg",
  "/images/hero1.jpeg",
  "/images/hero2.jpeg",
];
export default function WallpaperCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % wallpapers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? wallpapers.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wallpapers.length);
  };

  return (
    <section className="relative h-screen min-h-[400px] w-full flex items-center justify-center text-white overflow-hidden">
  
  {/* BACKGROUND IMAGE */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `url(${wallpapers[currentIndex]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-zinc-900/40" />

  {/* CONTENT */}
  <div className="relative z-10">
    {/* your existing content stays here */}
  </div>
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-4">
            <span className="block text-white">RADHIKA</span>
            <span className="block text-brand-green text-5xl sm:text-6xl lg:text-7xl">MACHINE</span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Radhika machine tools is the smartest investment for maximum productivity and unmatched quality
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link
              href="/products"
              className="group bg-brand-accent text-brand-green-dark font-bold py-4 px-8 rounded-full text-lg hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3 min-w-[200px] justify-center"
            >
              Explore Our Machines
              <ArrowRight 
                size={20} 
                className="transition-transform duration-300 group-hover:translate-x-1" 
              />
            </Link>
            
            <Link
              href="/contact"
              className="group bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-full text-lg hover:bg-white hover:text-brand-green-dark transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center backdrop-blur-sm"
            >
              <Play size={18} />
              Get Quote
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-accent">25+</div>
              <div className="text-sm text-gray-300 mt-1">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-accent">500+</div>
              <div className="text-sm text-gray-300 mt-1">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-accent">50+</div>
              <div className="text-sm text-gray-300 mt-1">Machine Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-accent">24/7</div>
              <div className="text-sm text-gray-300 mt-1">Support</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-zinc-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-zinc-800 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {wallpapers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}