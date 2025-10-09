// app/components/Footer.tsx

import Link from "next/link";
import Image from "next/image"; // ✨ Import the Image component
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-brand-green-dark to-brand-green-deeper text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            {/* ✨ Replaced text with logo and company name */}
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
              <span className="text-xl font-bold text-white">
                Radhika Machineries
              </span>
            </Link>
            <p className="text-gray-300">
              Engineering excellence in stone processing machinery for the
              global stone industry.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="#"
                className="text-gray-300 hover:text-brand-green-light"
              >
                {" "}
                {/* ✨ Updated */}
                <Facebook />
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-brand-green-light"
              >
                {" "}
                {/* ✨ Updated */}
                <Twitter />
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-brand-green-light"
              >
                {" "}
                {/* ✨ Updated */}
                <Linkedin />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-green-light">
              {" "}
              {/* ✨ Updated */}
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-green-light">
              {" "}
              {/* ✨ Updated */}
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-300 hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/service-center"
                  className="text-gray-300 hover:text-white"
                >
                  Service Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-green-light">
              {" "}
              {/* ✨ Updated */}
              Contact Info
            </h4>
            {/* ✨ Updated contact info for consistency */}
            <p className="text-gray-300">
              <span className="font-bold">Unit-1:</span> Plot No. 06, Ram Nagar,
              Sangriya, Jodhpur
            </p>
            <p className="text-gray-300 mt-1">
              <span className="font-bold">Unit-2:</span> J-65, RIICO, 1st Phase,
              Sangriya, Jodhpur
            </p>
            <p className="text-gray-300 mt-2">Email: rmt.jodhpur@gmail.com</p>
            <p className="text-gray-300 mt-2">Phone: +91 9983813366</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-600 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Radhika Machineries. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
