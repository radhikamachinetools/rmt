"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, X } from "lucide-react";

type GalleryCategory = {
  _id: string;
  name: string;
  slug: string;
  headerImage: string;
  displayOrder: number;
};

type GalleryItem = {
  _id: string;
  categoryId: string;
  type: "image" | "video";
  url: string;
  title: string;
  displayOrder: number;
};

export default function GalleryCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchGalleryData();
    }
  }, [slug]);

  const fetchGalleryData = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      
      if (data.success) {
        const foundCategory = data.categories.find((cat: GalleryCategory) => cat.slug === slug);
        if (foundCategory) {
          setCategory(foundCategory);
          const categoryItems = data.items.filter((item: GalleryItem) => item.categoryId === foundCategory._id);
          setItems(categoryItems);
        }
      }
    } catch (error) {
      console.error('Error fetching gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gallery Category Not Found</h1>
          <Link href="/gallery" className="text-brand-green hover:text-brand-green-dark">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
            >
              <X size={32} />
            </button>
            
            {selectedItem.type === 'image' ? (
              <div className="relative">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.title || 'Gallery image'}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                {selectedItem.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                    <h3 className="text-white text-lg font-semibold">{selectedItem.title}</h3>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full h-auto max-h-[80vh] rounded-lg"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
                {selectedItem.title && (
                  <div className="mt-4 text-center">
                    <h3 className="text-white text-lg font-semibold">{selectedItem.title}</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <section className="relative h-96 bg-gradient-to-r from-brand-green-dark to-brand-green flex items-center justify-center">
        {category.headerImage && (
          <>
            <Image
              src={category.headerImage}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        )}
        <div className="relative z-10 text-center text-white">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Gallery
          </Link>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl text-green-100">
            {items.length} {items.length === 1 ? 'item' : 'items'} in this gallery
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl text-gray-400">📷</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items in this gallery yet</h3>
              <p className="text-muted mb-6">Content is being prepared for this gallery category.</p>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark"
              >
                <ArrowLeft size={16} />
                Back to Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <div className="relative h-64 bg-gray-200">
                    {item.type === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.title || 'Gallery image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={24} className="text-brand-green ml-1" />
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Type indicator */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'image' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.type === 'image' ? 'Photo' : 'Video'}
                      </span>
                    </div>
                  </div>
                  
                  {item.title && (
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-brand-green-dark to-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Interested in Our {category.name}?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get in touch with our team to learn more about our processes and capabilities
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-green-dark font-semibold px-8 py-4 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
          >
            Contact Us
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}