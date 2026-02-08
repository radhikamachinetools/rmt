"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";

type InfrastructureItem = {
  _id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
  order: number;
};

export default function InfrastructurePage() {
  const [items, setItems] = useState<InfrastructureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/infrastructure');
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching infrastructure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList, type: 'image' | 'video') => {
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('files', file));
      formData.append('type', type);
      
      const uploadRes = await fetch('/api/upload-infrastructure', {
        method: 'POST',
        body: formData
      });
      
      const uploadData = await uploadRes.json();
      if (uploadData.success) {
        fetchItems();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/infrastructure?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const updateItem = async (id: string, updates: Partial<InfrastructureItem>) => {
    try {
      const res = await fetch(`/api/infrastructure?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Our Infrastructure</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'image')}
              className="hidden"
              id="imageUpload"
              disabled={uploading}
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              <Upload size={32} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Click to upload infrastructure images</p>
              <p className="text-sm text-gray-500">Select multiple files</p>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload Videos</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'video')}
              className="hidden"
              id="videoUpload"
              disabled={uploading}
            />
            <label htmlFor="videoUpload" className="cursor-pointer">
              <Upload size={32} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Click to upload infrastructure videos</p>
              <p className="text-sm text-gray-500">Select multiple files</p>
            </label>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">Uploading files...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-video bg-gray-100">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>
            <div className="p-4">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(item._id, { title: e.target.value })}
                className="w-full font-semibold text-gray-900 mb-2 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-green rounded px-2 py-1"
                placeholder="Enter title"
              />
              <textarea
                value={item.description || ''}
                onChange={(e) => updateItem(item._id, { description: e.target.value })}
                className="w-full text-sm text-gray-600 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-green rounded px-2 py-1 resize-none"
                rows={2}
                placeholder="Enter description"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                  {item.type}
                </span>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No infrastructure items uploaded yet</p>
          <p className="text-sm text-gray-400">Upload images and videos to showcase your infrastructure</p>
        </div>
      )}
    </div>
  );
}