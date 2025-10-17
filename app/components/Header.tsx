// app/components/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productCategories = [
    { name: "C-2300 Block Cutter", href: "/products/c-2300-block-cutter" },
    { name: "LPM Disk Polishing Machine", href: "/products/lpm-disk-polishing-machine" },
    { name: "LPM Flicker Machine", href: "/products/lpm-flicker-machine" },
    { name: "Stone Processing Machine", href: "/products/stone-processing-machine" },
    { name: "WSM Wire Saw Machine", href: "/products/wsm-wire-saw-machine" },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-brand-green-deeper text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+91 9983813366</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>rmt.jodhpur@gmail.com</span>
            </div>
          </div>
          <div className="text-xs">
            Unit-1: Plot No. 06, Ram Nagar, Sangriya, Jodhpur
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-gradient-to-r from-brand-green-dark to-brand-green text-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-xl backdrop-blur-sm bg-opacity-95" : ""
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/images/radhika-logo.png"
                    alt="Radhika Machine Tools Logo"
                    width={45}
                    height={45}
                    className="lg:w-[55px] lg:h-[55px] rounded-full ring-2 ring-white/20"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl lg:text-2xl font-bold text-white">
                    Radhika Machine Tools
                  </span>
                  <p className="text-xs text-green-100 -mt-1">
                    Engineering Excellence
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8">
              <Link
                href="/"
                className="text-green-100 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/about"
                className="text-green-100 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="relative group">
                <Link
                  href="/products"
                  className="text-green-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-1"
                >
                  Products
                  <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    {productCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-brand-green-dark transition-colors text-sm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href="/contact"
                className="text-green-100 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                Contact Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className="bg-brand-accent text-brand-green-dark font-semibold px-6 py-2.5 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-brand-green-light rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white shadow-xl border-t border-gray-200 animate-slide-up">
            <div className="py-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-3 text-gray-800 hover:bg-green-50 hover:text-brand-green-dark transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-3 text-gray-800 hover:bg-green-50 hover:text-brand-green-dark transition-colors font-medium"
              >
                About Us
              </Link>

              <div className="border-t border-gray-100">
                <div className="px-6 py-3 flex justify-between items-center">
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
                    aria-label="Toggle products menu"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 text-gray-600 ${
                        isProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {isProductsOpen && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {productCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-10 py-2.5 text-sm text-gray-700 hover:text-brand-green-dark hover:bg-green-50 transition-colors"
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
                className="block px-6 py-3 text-gray-800 hover:bg-green-50 hover:text-brand-green-dark transition-colors font-medium border-t border-gray-100"
              >
                Contact Us
              </Link>

              <div className="px-6 py-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-brand-green-dark text-white font-semibold py-3 rounded-lg hover:bg-brand-green transition-colors"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;