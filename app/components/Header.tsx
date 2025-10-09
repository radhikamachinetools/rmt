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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* ✨ Logo and Text are now side-by-side */}
            <Link href="/" className="flex items-center gap-3">
              {/* ✨ Circular container to make the logo visible */}
              <div className="p-1">
                <Image
                  src="/images/radhika-logo.png"
                  alt="Radhika Machineries Logo"
                  width={55}
                  height={55}
                  priority
                  className="rounded-full"
                />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Radhika Machine Tools
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              About Us
            </Link>
            <Link
              href="/products"
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              Products
            </Link>
            <Link
              href="/contact"
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
        <div className="md:hidden bg-white py-4 text-dark-gray">
          <Link
            href="/"
            className="block px-4 py-2 hover:bg-light-gray hover:text-brand-green-dark"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 hover:bg-light-gray hover:text-brand-green-dark"
          >
            About Us
          </Link>

          <div className="px-4 py-2 flex justify-between items-center">
            <Link href="/products" className="hover:text-brand-green-dark">
              Products
            </Link>
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="p-2"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isProductsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {isProductsOpen && (
            <div className="pl-8">
              {productCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block py-2 text-sm text-gray-700 hover:text-brand-green-dark"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/contact"
            className="block px-4 py-2 hover:bg-light-gray hover:text-brand-green-dark"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
