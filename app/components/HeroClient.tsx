// app/components/HeroClient.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroClient() {
  return (
    <motion.div
      className="relative z-10 text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
        Engineering the Future of Stone Processing
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
        Radhika Machineries delivers precision, durability, and unmatched
        performance in every machine we build.
      </p>
      <Link
        href="/products"
        className="bg-brand-green-light text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-green-dark transition-all duration-300 transform hover:scale-105"
      >
        Explore Our Machines
      </Link>
    </motion.div>
  );
}
