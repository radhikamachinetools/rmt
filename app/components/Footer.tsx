// app/components/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-deeper text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Image
                  src="/images/radhika-logo.png"
                  alt="Radhika Machine Tools Logo"
                  width={50}
                  height={50}
                  className="rounded-full ring-2 ring-white/20"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white block">
                  Radhika Machine Tools
                </span>
                <span className="text-xs text-green-100">
                  Engineering Excellence
                </span>
              </div>
            </Link>
            
            <p className="text-green-100 mb-6 leading-relaxed">
              Engineering excellence in stone processing machinery for the
              global stone industry. Trusted by 500+ clients worldwide.
            </p>
            
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-accent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-accent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-accent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-brand-accent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-accent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-2"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-2"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-accent">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-2"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/service-center"
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-brand-accent rounded-full transition-all duration-300 group-hover:w-2"></span>
                  Service Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-accent">
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-brand-accent mt-1 flex-shrink-0" size={18} />
                <div className="text-green-100">
                  <p className="font-medium text-white mb-1">Unit-1:</p>
                  <p className="text-sm">Plot No. 06, Ram Nagar, Sangriya, Jodhpur</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="text-brand-accent mt-1 flex-shrink-0" size={18} />
                <div className="text-green-100">
                  <p className="font-medium text-white mb-1">Unit-2:</p>
                  <p className="text-sm">J-65, RIICO, 1st Phase, Sangriya, Jodhpur</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="text-brand-accent flex-shrink-0" size={18} />
                <a 
                  href="mailto:rmt.jodhpur@gmail.com"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  rmt.jodhpur@gmail.com
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="text-brand-accent flex-shrink-0" size={18} />
                <a 
                  href="tel:+919983813366"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  +91 9983813366
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="text-brand-accent flex-shrink-0" size={18} />
                <div className="text-green-100">
                  <p className="text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-green-100 text-center lg:text-left">
              &copy; {new Date().getFullYear()} Radhika Machine Tools. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-green-100">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;