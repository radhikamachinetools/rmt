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
        

        {/* CTA Buttons - KEEP EXACT STRUCTURE */}
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
            Get Quote
          </Link>
        </motion.div>

        {/* Stats - KEEP EXACT STRUCTURE */}
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