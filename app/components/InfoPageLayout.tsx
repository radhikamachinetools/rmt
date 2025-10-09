// app/components/InfoPageLayout.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type InfoPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function InfoPageLayout({
  title,
  children,
}: InfoPageLayoutProps) {
  return (
    <div>
      <motion.section
        className="py-20 bg-gradient-to-r from-brand-green-dark to-brand-green-deeper text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">{title}</h1>
        </div>
      </motion.section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose lg:prose-lg max-w-none text-gray-700">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
