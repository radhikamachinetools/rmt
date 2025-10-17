"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CreateMedia() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    activeFrom: '',
    activeTo: '',
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let mediaUrl = '';
      
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
        resource_type: formData.file?.type.startsWith('video/') ? 'video' : 'image',
        isActive: formData.isActive,
        activeFrom: formData.activeFrom,
        activeTo: formData.activeTo
      };

      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaData)
      });

      if (res.ok) {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg bg-green-500 text-white';
        toast.textContent = '✓ Media created successfully!';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
        
        router.push('/admin/media');
      }
    } catch (error) {
      console.error('Error creating media:', error);
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Media</h1>
          <p className="text-gray-600 mt-1">Create new media content</p>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">File *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                className="hidden"
                id="mediaFile"
                required
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
                    <p className="text-gray-600">Click to upload file</p>
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
            {saving ? "Creating..." : "Create Media"}
          </button>
        </div>
      </form>
    </div>
  );
}