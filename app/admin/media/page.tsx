"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Eye } from "lucide-react";
import Image from "next/image";

export default function MediaAdmin() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadResult = await uploadRes.json();
        
        if (uploadResult.success) {
          await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: uploadResult.filePath,
              resource_type: file.type.startsWith('video/') ? 'video' : 'image',
              filename: uploadResult.fileName
            })
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setUploading(false);
    fetchMedia();
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-4 sm:mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{media.length} files total</p>
        </div>
        
        <label className="inline-flex items-center justify-center gap-2 bg-brand-green-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-brand-green-light transition-colors shadow-sm font-medium text-sm sm:text-base cursor-pointer">
          <Upload size={18} className="sm:hidden" />
          <Upload size={20} className="hidden sm:block" />
          {uploading ? 'Uploading...' : 'Upload Media'}
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {media.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Upload size={24} className="sm:hidden text-gray-400" />
            <Upload size={32} className="hidden sm:block text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No media files yet</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">Upload images and videos to showcase your factory</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {media.map((item: any, index) => (
            <div key={index} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {item.resource_type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <Image
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                    <Eye size={16} className="text-gray-700" />
                  </button>
                  <button className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors">
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              </div>
              
              {item.resource_type === 'video' && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                  Video
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}