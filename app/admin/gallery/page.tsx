"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Image, Video, FolderOpen } from "lucide-react";

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

export default function GalleryAdmin() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"categories" | "items">("categories");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"category" | "item">("category");
  const [editingItem, setEditingItem] = useState<GalleryCategory | GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    type: "image" as "image" | "video",
    url: "",
    title: "",
    headerImage: "",
    displayOrder: 0
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, type: 'category' | 'item', id: string, name: string}>({show: false, type: 'category', id: '', name: ''});

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMediaFiles(files);
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === files.length) {
            setMediaPreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to upload media');
    }
    
    return data.url;
  };

  const uploadMultipleMedia = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadMedia(file));
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalType === 'category') {
        // Handle category creation/update
        let finalFormData = { ...formData };
        
        if (mediaFiles.length > 0) {
          const mediaUrl = await uploadMedia(mediaFiles[0]);
          finalFormData.headerImage = mediaUrl;
        }
        
        if (editingItem) {
          const res = await fetch(`/api/gallery/categories/${(editingItem as any)._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: finalFormData.name, headerImage: finalFormData.headerImage, displayOrder: finalFormData.displayOrder })
          });
          
          const data = await res.json();
          
          if (data.success) {
            setToast({ message: 'Category updated successfully!', type: 'success' });
            fetchGallery();
            resetForm();
          } else {
            setToast({ message: data.error || 'Failed to update', type: 'error' });
          }
        } else {
          const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'category', name: finalFormData.name, headerImage: finalFormData.headerImage, displayOrder: finalFormData.displayOrder })
          });
          
          const data = await res.json();
          
          if (data.success) {
            setToast({ message: 'Category created successfully!', type: 'success' });
            fetchGallery();
            resetForm();
          } else {
            setToast({ message: data.error || 'Failed to save', type: 'error' });
          }
        }
      } else {
        // Handle multiple item creation
        if (mediaFiles.length > 0) {
          const mediaUrls = await uploadMultipleMedia(mediaFiles);
          
          // Create multiple items
          const createPromises = mediaUrls.map((url, index) => {
            const itemData = {
              type: 'item',
              categoryId: formData.categoryId,
              itemType: formData.type,
              url: url,
              title: formData.title ? `${formData.title} ${index + 1}` : `Item ${index + 1}`,
              displayOrder: formData.displayOrder + index
            };
            
            return fetch('/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(itemData)
            });
          });
          
          const responses = await Promise.all(createPromises);
          const allSuccessful = responses.every(res => res.ok);
          
          if (allSuccessful) {
            setToast({ message: `${mediaUrls.length} items created successfully!`, type: 'success' });
            fetchGallery();
            resetForm();
          } else {
            setToast({ message: 'Some items failed to create', type: 'error' });
          }
        } else if (formData.url) {
          // Single item with URL
          const payload = {
            type: 'item',
            categoryId: formData.categoryId,
            itemType: formData.type,
            url: formData.url,
            title: formData.title,
            displayOrder: formData.displayOrder
          };
          
          if (editingItem) {
            const res = await fetch(`/api/gallery/items/${(editingItem as any)._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            
            if (data.success) {
              setToast({ message: 'Item updated successfully!', type: 'success' });
              fetchGallery();
              resetForm();
            } else {
              setToast({ message: data.error || 'Failed to update', type: 'error' });
            }
          } else {
            const res = await fetch('/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            
            if (data.success) {
              setToast({ message: 'Item created successfully!', type: 'success' });
              fetchGallery();
              resetForm();
            } else {
              setToast({ message: data.error || 'Failed to save', type: 'error' });
            }
          }
        }
      }
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Error saving item', type: 'error' });
    }
    
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      categoryId: "", 
      type: "image", 
      url: "", 
      title: "", 
      headerImage: "", 
      displayOrder: 0 
    });
    setEditingItem(null);
    setShowModal(false);
    setMediaFiles([]);
    setMediaPreviews([]);
  };

  const handleEdit = (item: GalleryCategory | GalleryItem, type: 'category' | 'item') => {
    setEditingItem(item);
    setModalType(type);
    
    if (type === 'category') {
      const category = item as GalleryCategory;
      setFormData({
        name: category.name,
        categoryId: "",
        type: "image",
        url: "",
        title: "",
        headerImage: category.headerImage,
        displayOrder: category.displayOrder
      });
      setMediaPreviews(category.headerImage ? [category.headerImage] : []);
    } else {
      const galleryItem = item as GalleryItem;
      setFormData({
        name: "",
        categoryId: galleryItem.categoryId,
        type: galleryItem.type,
        url: galleryItem.url,
        title: galleryItem.title,
        headerImage: "",
        displayOrder: galleryItem.displayOrder
      });
      setMediaPreviews([galleryItem.url]);
    }
    
    setShowModal(true);
  };

  const confirmDelete = (id: string, name: string, type: 'category' | 'item') => {
    setDeleteModal({show: true, type, id, name});
  };

  const handleDelete = async () => {
    const { type, id } = deleteModal;
    setDeleteModal({show: false, type: 'category', id: '', name: ''});
    
    try {
      const endpoint = type === 'category' 
        ? `/api/gallery/categories/${id}`
        : `/api/gallery/items/${id}`;
      
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok) {
        setToast({ message: `${type === 'category' ? 'Category' : 'Item'} deleted successfully!`, type: 'success' });
        fetchGallery();
      } else {
        setToast({ message: data.error || 'Failed to delete', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error deleting item', type: 'error' });
    }
    
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (type: "category" | "item") => {
    setModalType(type);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.message}
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete {deleteModal.type === 'category' ? 'Category' : 'Item'}</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>?
              {deleteModal.type === 'category' && ' This will also delete all items in this category.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({show: false, type: 'category', id: '', name: ''})}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit' : 'Add'} {modalType === 'category' ? 'Gallery Category' : 'Gallery Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'category' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      placeholder="e.g., Manufacturing Process"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Header Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMediaChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Or enter image URL"
                        value={formData.headerImage}
                        onChange={(e) => {
                          setFormData({...formData, headerImage: e.target.value});
                          setMediaPreviews(e.target.value ? [e.target.value] : []);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                      {mediaPreviews.length > 0 && (
                        <div className="mt-2">
                          <img
                            src={mediaPreviews[0]}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as "image" | "video"})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Media *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                        multiple
                        onChange={handleMediaChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Or enter media URL"
                        value={formData.url}
                        onChange={(e) => {
                          setFormData({...formData, url: e.target.value});
                          setMediaPreviews(e.target.value ? [e.target.value] : []);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                        required={mediaFiles.length === 0}
                      />
                      <p className="text-xs text-gray-500">Select multiple files to upload them all at once</p>
                      {mediaPreviews.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {mediaPreviews.map((preview, index) => (
                            <div key={index}>
                              {formData.type === 'image' ? (
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-16 object-cover rounded-lg border"
                                />
                              ) : (
                                <video
                                  src={preview}
                                  className="w-full h-16 object-cover rounded-lg border"
                                  controls
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (Base name for multiple files)
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      placeholder="Optional title"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-muted mt-1">Manage gallery categories and media items</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("categories")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "categories"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen size={16} />
                Categories ({categories.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "items"
                  ? "border-brand-green text-brand-green"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Image size={16} />
                Items ({items.length})
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "categories" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gallery Categories</h2>
                <button
                  onClick={() => openModal("category")}
                  className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green-dark"
                >
                  <Plus size={16} />
                  Add Category
                </button>
              </div>
              
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
                  <p className="text-gray-600 mb-4">Create your first gallery category</p>
                  <button
                    onClick={() => openModal("category")}
                    className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green-dark mx-auto"
                  >
                    <Plus size={16} />
                    Add Category
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEdit(category, 'category')}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => confirmDelete(category._id, category.name, 'category')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Slug: {category.slug}</p>
                      <p className="text-sm text-gray-600">Order: {category.displayOrder}</p>
                      <p className="text-sm text-gray-600">
                        Items: {items.filter(item => item.categoryId === category._id).length}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gallery Items</h2>
                <button
                  onClick={() => openModal("item")}
                  className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green-dark"
                  disabled={categories.length === 0}
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create categories first</h3>
                  <p className="text-gray-600">You need to create gallery categories before adding items</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <Image size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-600 mb-4">Add your first gallery item</p>
                  <button
                    onClick={() => openModal("item")}
                    className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green-dark mx-auto"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => {
                    const category = categories.find(cat => cat._id === item.categoryId);
                    return (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {item.type === 'image' ? <Image size={16} /> : <Video size={16} />}
                            <span className="font-medium text-gray-900">{item.title || 'Untitled'}</span>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleEdit(item, 'item')}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => confirmDelete(item._id, item.title || 'Untitled', 'item')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Category: {category?.name}</p>
                        <p className="text-sm text-gray-600 mb-2">Type: {item.type}</p>
                        <p className="text-sm text-gray-600 truncate">URL: {item.url}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}