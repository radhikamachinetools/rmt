// app/components/ProductCardClient.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

type Product = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
};

type ProductCardProps = {
  product: Product;
  index: number;
};

export default function ProductCardClient({
  product,
  index,
}: ProductCardProps) {
  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 hover:-translate-y-2"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <Image
          src={product.imageUrl || "/images/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-brand-green text-white px-3 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            href={`/products/${product.slug}`}
            className="bg-white text-brand-green-dark px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-xl"
          >
            <Eye size={18} />
            View Details
          </Link>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-dark-gray group-hover:text-brand-green-dark transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-muted mb-4 line-clamp-3 leading-relaxed">
          {product.shortDescription}
        </p>
        
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-brand-green-dark font-semibold hover:text-brand-green transition-colors duration-300 group/link"
        >
          Learn More
          <ArrowRight 
            size={16} 
            className="transition-transform duration-300 group-hover/link:translate-x-1" 
          />
        </Link>
      </div>
    </motion.div>
  );
}