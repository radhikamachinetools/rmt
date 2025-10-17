"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

export default function EditMedia() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    activeFrom: '',
    activeTo: '',
    file: null as File | null
  });

  useEffect(() => {
    if (params.id) {
      fetchMedia();
    }
  }, [params.id]);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) {
        const mediaItem = data.media.find((item: MediaItem) => item.id === params.id);
        if (mediaItem) {
          setMedia(mediaItem);
          setFormData({
            title: mediaItem.title,
            description: mediaItem.description,
            isActive: mediaItem.isActive,
            activeFrom: mediaItem.activeFrom,
            activeTo: mediaItem.activeTo,
            file: null
          });
        }
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let mediaUrl = media?.url || '';
      
      if (formData.file) {
        const uploadFormData = new FormData();
        uploadFormData.append('files', formData.file);
        uploadFormData.append('slug', 'media');
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });
        
        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          mediaUrl = uploadResult.paths[0];
        }
      }

      const mediaData = {
        title: formData.title,
        description: formData.description,
        url: mediaUrl,
        resource_type: formData.file ? (formData.file.type.startsWith('video/') ? 'video' : 'image') : media?.resource_type,
        isActive: formData.isActive,
        activeFrom: formData.activeFrom,
        activeTo: formData.activeTo
      };

      const res = await fetch(`/api/media/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaData)
      });

      if (res.ok) {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg bg-green-500 text-white';
        toast.textContent = '✓ Media updated successfully!';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
        
        router.push('/admin/media');
      }
    } catch (error) {
      console.error('Error updating media:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="bg-white rounded-xl p-8">
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Media Not Found</h1>
        <button
          onClick={() => router.push('/admin/media')}
          className="text-brand-green hover:text-brand-green-dark"
        >
          ← Back to Media
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Media</h1>
          <p className="text-gray-600 mt-1">Update media information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current File</label>
            {media && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                {media.resource_type === 'video' ? (
                  <video src={media.url} className="w-32 h-32 object-cover rounded-lg" muted />
                ) : (
                  <img src={media.url} alt={media.title} className="w-32 h-32 object-cover rounded-lg" />
                )}
                <p className="text-sm text-gray-600 mt-2">Current: {media.resource_type}</p>
              </div>
            )}
            
            <label className="block text-sm font-semibold text-gray-700 mb-2">Change File (optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                className="hidden"
                id="mediaFile"
              />
              <label htmlFor="mediaFile" className="cursor-pointer">
                {formData.file ? (
                  <div className="space-y-2">
                    {formData.file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(formData.file)} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <span className="text-2xl">🎥</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">{formData.file.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl text-gray-400">📁</span>
                    </div>
                    <p className="text-gray-600">Click to change file</p>
                    <p className="text-sm text-gray-500">Images and videos supported</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-5 h-5 text-brand-green border-gray-300 rounded focus:ring-brand-green-light"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Active From</label>
              <input
                type="date"
                value={formData.activeFrom}
                onChange={(e) => setFormData(prev => ({ ...prev, activeFrom: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Active To</label>
              <input
                type="date"
                value={formData.activeTo}
                onChange={(e) => setFormData(prev => ({ ...prev, activeTo: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-8 py-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-light disabled:opacity-50 font-medium"
          >
            {saving ? "Updating..." : "Update Media"}
          </button>
        </div>
      </form>
    </div>
  );
}