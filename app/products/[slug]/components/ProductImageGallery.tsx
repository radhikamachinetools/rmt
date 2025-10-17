"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group">
          <Image
            src={images[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            fill
            className="object-cover cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 rounded-full p-3">
              <ZoomIn size={24} className="text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square bg-white rounded-lg overflow-hidden shadow cursor-pointer transition-all ${
                  selectedImage === index ? "ring-2 ring-brand-green" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-7xl max-h-full w-full h-full">
            <Image
              src={images[selectedImage]}
              alt={`${productName} - Zoomed`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}