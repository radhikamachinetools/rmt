// app/products/[slug]/components/ProductDetailsClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Wrench,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

// --- Type Definitions (matching the data from the server) ---
type Product = {
  name: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
  description: string;
  keyFeatures: string[];
  specifications: { spec: string; value: string }[];
  galleryUrls: string[];
};

type ProductDetailsClientProps = {
  product: Product;
};

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", icon: <CheckCircle /> },
    { id: "features", label: "Key Features", icon: <Wrench /> },
    { id: "specs", label: "Specifications", icon: <Settings /> },
    { id: "gallery", label: "Photo & Video", icon: <ImageIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        );
      case "features":
        return (
          <ul className="space-y-3">
            {product.keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-brand-green-light mr-3 mt-1 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        );
      case "specs":
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                {product.specifications.map((spec, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 pr-4 font-semibold text-gray-800">
                      {spec.spec}
                    </td>
                    <td className="py-3 text-gray-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "gallery":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.galleryUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`${product.name} gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Image */}
        <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
          <Image
            src={product.imageUrl || "/images/placeholder.png"} // Use imageUrl with a fallback
            alt={product.name}
            fill
            className="object-contain bg-gray-100 p-4"
          />
        </div>

        {/* Right Side: Details */}
        <div>
          <p className="text-sm text-brand-green-dark font-semibold mb-2">
            {product.category}
          </p>
          <h1 className="text-4xl font-bold text-dark-gray mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {product.shortDescription}
          </p>
          <Link
            href="/contact"
            className="bg-brand-green-dark text-white font-bold py-3 px-8 rounded-full hover:bg-brand-green-light transition-colors duration-300"
          >
            Request a Quote
          </Link>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-brand-green-dark text-brand-green-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="py-8">{renderContent()}</div>
      </div>
    </div>
  );
}
