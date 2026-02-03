"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

type Product = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
  features?: string[];
  specifications?: any;
};

type ProductHeroCarouselProps = {
  products: Product[];
};

export default function ProductHeroCarousel({ products }: ProductHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-light-gray">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-green-dark">
            Our Flagship Products
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            No featured products available
          </p>
        </div>
      </section>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <img
          src={currentProduct.imageUrl || '/images/wallpaper1.jpeg'}
          alt={currentProduct.name}
          className="w-full h-full object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-0">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Our Flagship Products
          </h2>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            Discover our premium range of stone processing machinery, engineered for excellence
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Product Image */}
              <div className="w-full lg:w-1/3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm">
                  <img
                    src={currentProduct.imageUrl || '/images/wallpaper1.jpeg'}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-2/3 text-white text-center lg:text-left">
                <div className="mb-4">
                  <span className="bg-brand-accent text-brand-green-dark px-3 py-1 rounded-full text-sm font-medium">
                    {currentProduct.category}
                  </span>
                </div>
                
                <h3 className="text-2xl lg:text-4xl font-bold mb-4">
                  {currentProduct.name}
                </h3>
                
                <p className="text-lg lg:text-xl text-green-100 mb-6 leading-relaxed">
                  {currentProduct.shortDescription}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href={`/products/${currentProduct.slug}`}
                    className="bg-brand-accent text-brand-green-dark font-bold py-3 px-6 rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Eye size={20} />
                    View Details
                  </Link>
                  <Link
                    href="/contact"
                    className="border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-brand-green-dark transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={20} />
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Counter */}
        <div className="text-center mt-8">
          <span className="text-white/80 text-sm">
            {currentIndex + 1} of {products.length} Featured Products
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? "bg-brand-accent" 
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}