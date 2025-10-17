"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type MediaItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: string;
  isActive: boolean;
  activeFrom: string;
  activeTo: string;
};

export default function MediaSlider() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveMedia();
  }, []);

  useEffect(() => {
    if (media.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [media.length]);

  const fetchActiveMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) {
        const activeMedia = data.media.filter((item: MediaItem) => {
          if (!item.isActive) return false;
          
          const now = new Date();
          const activeFrom = item.activeFrom ? new Date(item.activeFrom) : null;
          const activeTo = item.activeTo ? new Date(item.activeTo) : null;
          
          if (activeFrom && now < activeFrom) return false;
          if (activeTo && now > activeTo) return false;
          
          return true;
        });
        setMedia(activeMedia);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200"></div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-brand-green-dark to-brand-green rounded-xl overflow-hidden flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🏭</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Factory Media Coming Soon</h3>
          <p className="text-white/80">We&apos;re preparing exciting content to showcase our manufacturing facility</p>
        </div>
      </div>
    );
  }

  const currentMedia = media[currentIndex];

  return (
    <div className="relative h-96 bg-gray-900 rounded-xl overflow-hidden group">
      {currentMedia.resource_type === 'video' ? (
        <div className="relative w-full h-full">
          <video
            src={currentMedia.url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <Play size={14} />
            Video
          </div>
        </div>
      ) : (
        <Image
          src={currentMedia.url}
          alt={currentMedia.title}
          fill
          className="object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{currentMedia.title}</h3>
        {currentMedia.description && (
          <p className="text-sm text-gray-200 line-clamp-2">{currentMedia.description}</p>
        )}
      </div>

      {media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}