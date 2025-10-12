// app/components/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image"; // ✨ Import the Image component
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const productCategories = [
    { name: "Granite Cutting Machines", href: "/products/granite-cutting" },
    { name: "Line Polishing Machines", href: "/products/line-polishing" },
    { name: "Handling Cranes", href: "/products/handling-cranes" },
    { name: "Epoxy Resin Line", href: "/products/epoxy-resin" },
  ];

  return (
    <header className="bg-gradient-to-r from-brand-green-dark to-brand-green-deeper text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="p-1">
                <Image
                  src="/images/radhika-logo.png"
                  alt="Radhika Machineries Logo"
                  width={40}
                  height={40}
                  className="sm:w-[55px] sm:h-[55px] rounded-full"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white hidden xs:block">
                Radhika Machine Tools
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-gray-200 hover:text-white transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-200 hover:text-white transition-colors duration-300 font-medium"
            >
              About Us
            </Link>
            <Link
              href="/products"
              className="text-gray-200 hover:text-white transition-colors duration-300 font-medium"
            >
              Products
            </Link>
            <Link
              href="/contact"
              className="text-gray-200 hover:text-white transition-colors duration-300 font-medium"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-brand-green-light rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="py-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 hover:text-brand-green-dark transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 hover:text-brand-green-dark transition-colors font-medium"
            >
              About Us
            </Link>

            <div className="border-t border-gray-200">
              <div className="px-4 py-3 flex justify-between items-center">
                <Link 
                  href="/products" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-800 hover:text-brand-green-dark font-medium"
                >
                  Products
                </Link>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 text-gray-600 ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {isProductsOpen && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {productCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-8 py-2 text-sm text-gray-700 hover:text-brand-green-dark hover:bg-gray-100 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-gray-800 hover:bg-gray-100 hover:text-brand-green-dark transition-colors font-medium border-t border-gray-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
