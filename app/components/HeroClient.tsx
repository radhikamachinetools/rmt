// app/components/HeroClient.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroClient() {
  return (
    <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium"
        >
          <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
          Trusted by 500+ Industries Worldwide
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight"
        >
          Engineering the Future of{" "}
          <span className="text-brand-accent">Stone Processing</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto text-gray-200 leading-relaxed"
        >
          Radhika Machine Tools delivers precision, durability, and unmatched
          performance in every machine we build. Transform your production with
          cutting-edge technology.
        </motion.p>

        {/* CTA Buttons */}
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
            Watch Demo
          </Link>
        </motion.div>

        {/* Stats */}
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
  );
}