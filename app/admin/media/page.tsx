"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Edit, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type MediaItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  resource_type: string;
  isActive: boolean;
  activeFrom: string;
  activeTo: string;
  createdAt: string;
};

export default function MediaAdmin() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, mediaId: string, mediaTitle: string}>({show: false, mediaId: '', mediaTitle: ''});

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMedia(data.success ? data.media : []);
    } catch {
      console.error('Error fetching media');
    } finally {
      setLoading(false);
    }
  };



  const confirmDelete = (id: string, title: string) => {
    setDeleteModal({show: true, mediaId: id, mediaTitle: title});
  };

  const deleteMedia = async () => {
    const { mediaId } = deleteModal;
    setDeleteModal({show: false, mediaId: '', mediaTitle: ''});
    
    try {
      const res = await fetch(`/api/media/${mediaId}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Media deleted successfully!', type: 'success' });
        fetchMedia();
      } else {
        setToast({ message: 'Failed to delete media', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error deleting media', type: 'error' });
    }
    if (toast) setTimeout(() => setToast(null), 3000);
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
        
        <Link
          href="/admin/media/create"
          className="inline-flex items-center justify-center gap-2 bg-brand-green-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-brand-green-light transition-colors shadow-sm font-medium text-sm sm:text-base"
        >
          <Plus size={18} className="sm:hidden" />
          <Plus size={20} className="hidden sm:block" />
          Add Media
        </Link>
      </div>

      {media.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Plus size={24} className="sm:hidden text-gray-400" />
            <Plus size={32} className="hidden sm:block text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No media files yet</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">Upload images and videos to showcase your factory</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {item.resource_type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
                
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {item.resource_type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    Video
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                {(item.activeFrom || item.activeTo) && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={12} />
                    <span>
                      {item.activeFrom && `From: ${new Date(item.activeFrom).toLocaleDateString()}`}
                      {item.activeFrom && item.activeTo && ' | '}
                      {item.activeTo && `To: ${new Date(item.activeTo).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Link
                    href={`/admin/media/edit/${item.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => confirmDelete(item.id, item.title)}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.message}
        </div>
      )}



      {deleteModal.show && (
   <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 9999}}>
          <div className="bg-brand-green-light rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Media</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete <strong>{deleteModal.mediaTitle}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({show: false, mediaId: '', mediaTitle: ''})}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteMedia}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}