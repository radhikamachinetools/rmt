// app/components/FeatureCardClient.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function FeatureCardClient({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg text-center"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center mb-4 text-brand-green-light">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </motion.div>
  );
}
