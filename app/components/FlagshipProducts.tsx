"use client";

import { useState, useEffect } from 'react';
import { ArrowRight, Eye, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  _id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  shortDescription?: string;
  description?: string;
  category: string;
  features?: string[];
  status?: string;
};

const FlagshipProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / productsPerSlide);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  if (loading) return <div className="py-24 text-center">Loading...</div>;
  if (products.length === 0) return <div className="py-24 text-center">No products found</div>;

  const getCurrentSlideProducts = () => {
    const startIndex = currentIndex * productsPerSlide;
    return products.slice(startIndex, startIndex + productsPerSlide);
  };

  return (
    <section className="py-12 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-green-dark">
            Our Flagship Products
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our premium range of stone processing machinery, engineered for excellence
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Slide {currentIndex + 1} of {totalSlides} | Total: {products.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {getCurrentSlideProducts().map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {totalSlides > 1 && (
          <div className="flex justify-center space-x-2 mb-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-brand-green-dark' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-green-dark text-white px-8 py-3 rounded-full hover:bg-brand-green transition-colors"
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {product.imageUrl ? (
          <Image
            src={`http://localhost:3001${product.imageUrl}`}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-brand-green text-white text-xs font-medium px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6">
          {product.shortDescription || product.description || `High-quality ${product.category.toLowerCase()} designed for optimal performance and reliability.`}
        </p>
        
        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-green-dark text-white px-4 py-2 rounded-lg hover:bg-brand-green transition-colors text-sm font-medium"
          >
            <Eye size={16} />
            View Details
          </Link>
          <Link
            href="/contact"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-brand-green-dark text-brand-green-dark px-4 py-2 rounded-lg hover:bg-brand-green-dark hover:text-white transition-colors text-sm font-medium"
          >
            <MessageCircle size={16} />
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlagshipProducts;