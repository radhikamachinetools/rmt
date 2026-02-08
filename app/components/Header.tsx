// app/components/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from './Header.module.css';

type Category = {
  _id: string;
  name: string;
  slug: string;
  status: string;
  displayOrder: number;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔍 Fetching categories from /api/categories');
        const response = await fetch('/api/categories');
        const data = await response.json();
        console.log('📊 Categories API response:', data);
        
        const activeCategories = data.categories
          ?.filter((c: Category) => c.status === 'active')
          ?.sort((a: Category, b: Category) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [];
        
        console.log('✅ Active categories:', activeCategories);
        setCategories(activeCategories);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const shouldShowText = !isHomePage || isScrolled;

  return (
    <>
      {/* Header Spacer - prevents content jump when header becomes fixed */}
      {isScrolled && <div className="h-16 lg:h-20"></div>}
      
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
      <header className={`bg-gradient-to-r from-brand-green-dark to-brand-green text-white shadow-lg transition-all duration-300 ${
        isScrolled ? "fixed top-0 left-0 right-0 z-50 shadow-xl backdrop-blur-sm bg-opacity-95" : "relative"
      }`}>
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${styles.headerContainer}`}>
          <div className={`flex items-center justify-between h-16 lg:h-20 ${styles.navContainer}`}>
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
                <div className={`transition-all duration-300 ${
                  shouldShowText ? 'opacity-100 max-w-none' : 'opacity-0 max-w-0 overflow-hidden'
                }`}>
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
            <nav className={`hidden lg:flex lg:items-center lg:space-x-6 ${styles.navContainer}`}>
              <a
                href="/uploads/RADHIKA MACHINE TOOLS-B.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-100 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                Check Brochure
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
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
              <div className={`relative group ${styles.dropdownContainer}`}>
                <div className="text-green-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-1 cursor-pointer">
                  Products
                  <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
                </div>
                {categories.length > 0 && (
                  <div className={`${styles.dropdownMenu}`}>
                    <div className="py-2">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products#${category.slug}`}
                          className={styles.dropdownItem}
                        >
                          {category.name}
                        </Link>
                      ))}
                      <Link
                        href="/products"
                        className={`${styles.dropdownItem} ${styles.dropdownDivider} font-medium text-brand-green-dark`}
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/gallery"
                className="text-green-100 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-green-100 hover:text-white transition-colors duration-300 font-medium relative group"
              >
                Contact Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden lg:block bg-brand-accent text-brand-green-dark font-semibold px-6 py-2.5 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Quote
            </Link>

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
              <a
                href="/uploads/RADHIKA MACHINE TOOLS-B.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-3 text-gray-800 hover:bg-green-50 hover:text-brand-green-dark transition-colors font-medium"
              >
                Check Brochure
              </a>
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

                {isProductsOpen && categories.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/products#${category.slug}`}
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
                href="/gallery"
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-3 text-gray-800 hover:bg-green-50 hover:text-brand-green-dark transition-colors font-medium border-t border-gray-100"
              >
                Gallery
              </Link>

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