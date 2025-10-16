// app/components/FeatureCardClient.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export default function FeatureCardClient({
  icon,
  title,
  children,
}: FeatureCardProps) {
  return (
    <motion.div
      className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-500 hover:-translate-y-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        {/* Icon Container */}
        <div className="w-20 h-20 bg-gradient-to-br from-brand-green-light to-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl lg:text-2xl font-bold mb-4 text-dark-gray group-hover:text-brand-green-dark transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted leading-relaxed">
          {children}
        </p>
      </div>

      {/* Decorative Element */}
      <div className="mt-6 w-12 h-1 bg-gradient-to-r from-brand-green to-brand-accent rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
}