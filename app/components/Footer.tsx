// app/components/Footer.tsx

import Link from "next/link";
import Image from "next/image"; // ✨ Import the Image component
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-brand-green-dark to-brand-green-deeper text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="p-1">
                <Image
                  src="/images/radhika-logo.png"
                  alt="Radhika Machineries Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">
                Radhika Machineries
              </span>
            </Link>
            <p className="text-gray-300 text-sm sm:text-base mb-4">
              Engineering excellence in stone processing machinery for the
              global stone industry.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-300 hover:text-brand-green-light transition-colors p-1"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-brand-green-light transition-colors p-1"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-brand-green-light transition-colors p-1"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-brand-green-light">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-brand-green-light">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/service-center"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Service Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-brand-green-light">
              Contact Info
            </h4>
            <div className="space-y-2 text-sm sm:text-base">
              <p className="text-gray-300">
                <span className="font-semibold">Unit-1:</span><br className="sm:hidden" />
                <span className="sm:ml-1">Plot No. 06, Ram Nagar, Sangriya, Jodhpur</span>
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Unit-2:</span><br className="sm:hidden" />
                <span className="sm:ml-1">J-65, RIICO, 1st Phase, Sangriya, Jodhpur</span>
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span><br className="sm:hidden" />
                <span className="sm:ml-1">rmt.jodhpur@gmail.com</span>
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Phone:</span><br className="sm:hidden" />
                <span className="sm:ml-1">+91 9983813366</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 border-t border-gray-600 pt-4 sm:pt-6 text-center text-gray-400">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Radhika Machineries. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
