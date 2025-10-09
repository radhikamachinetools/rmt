// app/components/ProductCardClient.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  slug: string;
  name: string;
  category: string; // ✨ Add this property
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
      key={product._id}
      className="bg-white rounded-lg shadow-lg overflow-hidden group border-b-4 border-transparent hover:border-brand-green-light transition-colors duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={product.imageUrl || "/images/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {/* ✨ Add this line to display the category */}
        <p className="text-sm text-brand-green-dark font-medium mb-1">
          {product.category}
        </p>
        <h3 className="text-xl font-bold mb-2 text-dark-gray">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">
          {product.shortDescription}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-auto inline-block text-center bg-brand-green-dark text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-green-light transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
