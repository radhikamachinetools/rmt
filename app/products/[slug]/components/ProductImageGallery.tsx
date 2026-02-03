"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, Play } from "lucide-react";

type ProductImageGalleryProps = {
  images: string[];
  videos?: string[];
  productName: string;
};

export default function ProductImageGallery({ images, videos = [], productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const allMedia = [...images, ...videos];
  const isVideo = (index: number) => index >= images.length;

  return (
    <>
      <div className="flex gap-4">
        {/* Main Media - Left Side */}
        <div className="flex-1 max-w-md">
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg group">
            {isVideo(selectedIndex) ? (
              <video
                src={allMedia[selectedIndex]}
                controls
                className="w-full h-full object-cover"
                poster={images[0]}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <>
                <Image
                  src={allMedia[selectedIndex]}
                  alt={`${productName} - Image ${selectedIndex + 1}`}
                  fill
                  className="object-cover cursor-zoom-in"
                  onClick={() => setIsZoomed(true)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 rounded-full p-3">
                    <ZoomIn size={24} className="text-gray-700" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Thumbnail Media - Right Side */}
        {allMedia.length > 1 && (
          <div className="w-32">
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
              {allMedia.map((media, index) => (
                <div
                  key={index}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden shadow cursor-pointer transition-all ${
                    selectedIndex === index ? "ring-2 ring-teal-600" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  {isVideo(index) ? (
                    <>
                      <video
                        src={media}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={12} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={media}
                      alt={`${productName} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && !isVideo(selectedIndex) && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-7xl max-h-full w-full h-full">
            <Image
              src={allMedia[selectedIndex]}
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