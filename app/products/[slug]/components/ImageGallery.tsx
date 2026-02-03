"use client";

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

type ImageGalleryProps = {
  images: string[];
  videos?: string[];
  productName: string;
  onImageClick?: (index: number) => void;
};

export default function ImageGallery({ images, videos = [], productName, onImageClick }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Combine images and videos into a single media array
  const mediaItems: MediaItem[] = [
    ...images.map(url => ({ type: 'image' as const, url })),
    ...videos.map(url => ({ type: 'video' as const, url }))
  ];

  const currentMedia = mediaItems[selectedIndex];

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="lg:w-1/2">
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[600px] h-[600px] flex items-center justify-center">
            {currentMedia?.type === 'video' ? (
              <video
                src={currentMedia.url}
                className="max-w-full max-h-full object-contain transition-all duration-300"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
                controls
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
              />
            ) : (
              <img
                src={currentMedia?.url || '/images/wallpaper1.jpeg'}
                alt={productName}
                className="max-w-full max-h-full object-contain transition-all duration-300"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
              />
            )}
          </div>
        </div>

        {mediaItems.length > 1 && (
          <div className="p-4">
            <div className="flex gap-3 overflow-x-auto">
              {mediaItems.map((media, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                    onImageClick?.(index);
                  }}
                  className={`relative flex-shrink-0 w-20 h-16 border-2 transition-all duration-200 ${
                    index === selectedIndex
                      ? 'border-orange-500 shadow-lg'
                      : 'border-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {media.type === 'video' ? (
                    <>
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Play size={12} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={media.url}
                      alt={`${productName} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}