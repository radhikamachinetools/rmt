"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, X, Plus } from "lucide-react";

type Specification = {
  spec: string;
  value: string;
};

type Product = {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
  description: string;
  keyFeatures: string[];
  specifications: Specification[];
  galleryUrls: string[];
  isFeatured?: boolean;
  order?: number;
  price?: number;
};

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product>({
    name: "",
    slug: "",
    category: "",
    shortDescription: "",
    description: "",
    keyFeatures: [""],
    specifications: [{ spec: "", value: "" }],
    galleryUrls: [],
    isFeatured: false,
    order: 0,
  });

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct({
          ...data.product,
          keyFeatures: data.product.keyFeatures?.length ? data.product.keyFeatures : [""],
          specifications: data.product.specifications?.length ? data.product.specifications : [{ spec: "", value: "" }],
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out empty key features and specifications
      const cleanedProduct = {
        ...product,
        keyFeatures: product.keyFeatures.filter(feature => feature.trim() !== ''),
        specifications: product.specifications.filter(spec => spec.spec.trim() !== '' && spec.value.trim() !== '')
      };

      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedProduct)
      });

      if (res.ok) {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setSaving(false);
    }
  };

  const addKeyFeature = () => {
    setProduct(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, ""]
    }));
  };

  const removeKeyFeature = (index: number) => {
    setProduct(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const updateKeyFeature = (index: number, value: string) => {
    setProduct(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature, i) => i === index ? value : feature)
    }));
  };

  const addSpecification = () => {
    setProduct(prev => ({
      ...prev,
      specifications: [...prev.specifications, { spec: "", value: "" }]
    }));
  };

  const removeSpecification = (index: number) => {
    setProduct(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, field: keyof Specification, value: string) => {
    setProduct(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
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
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} className="sm:hidden" />
          <ArrowLeft size={20} className="hidden sm:block" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => setProduct(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={product.price || ""}
                  onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Main Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('files', file);
                      formData.append('slug', product.slug || 'temp');
                      
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (data.success && data.paths?.[0]) {
                          setProduct(prev => ({ ...prev, imageUrl: data.paths[0] }));
                        }
                      } catch (error) {
                        console.error('Upload failed:', error);
                      }
                    }
                  }}
                  className="hidden"
                  id="editMainImage"
                />
                <label htmlFor="editMainImage" className="cursor-pointer">
                  {product.imageUrl ? (
                    <div className="space-y-2 relative group">
                      <img src={product.imageUrl} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setProduct(prev => ({ ...prev, imageUrl: "" }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <span className="text-2xl text-gray-400">📷</span>
                      </div>
                      <p className="text-gray-600">Click to upload main image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gallery Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    const currentImages = product.galleryUrls || product.images || [];
                    
                    if (files.length > 0) {
                      const formData = new FormData();
                      files.forEach(file => formData.append('files', file));
                      formData.append('slug', product.slug || 'temp');
                      
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (data.success && data.paths) {
                          const allImages = [...currentImages, ...data.paths];
                          setProduct(prev => ({ ...prev, galleryUrls: allImages, images: allImages }));
                        }
                      } catch (error) {
                        console.error('Upload failed:', error);
                      }
                    }
                  }}
                  className="hidden"
                  id="editGalleryImages"
                />
                <label htmlFor="editGalleryImages" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl text-gray-400">🖼️</span>
                    </div>
                    <p className="text-gray-600">Click to add more gallery images</p>
                    <p className="text-sm text-gray-500">Select multiple files</p>
                  </div>
                </label>
              </div>
              {(product.galleryUrls?.length > 0 || product.images?.length > 0) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Gallery Images ({(product.galleryUrls || product.images || []).length}):</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(product.galleryUrls || product.images || []).map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const currentImages = product.galleryUrls || product.images || [];
                            const newImages = currentImages.filter((_, i) => i !== index);
                            setProduct(prev => ({ ...prev, galleryUrls: newImages, images: newImages }));
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={product.shortDescription}
                  onChange={(e) => setProduct(prev => ({ ...prev, shortDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                <button
                  type="button"
                  onClick={addKeyFeature}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-light"
                >
                  <Plus size={16} />
                  Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {product.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateKeyFeature(index, e.target.value)}
                      placeholder="Enter key feature"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-light"
                >
                  <Plus size={16} />
                  Add Specification
                </button>
              </div>
              <div className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={spec.spec}
                      onChange={(e) => updateSpecification(index, "spec", e.target.value)}
                      placeholder="Specification name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={product.isFeatured || false}
                  onChange={(e) => setProduct(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-5 h-5 text-brand-green-dark border-gray-300 rounded focus:ring-brand-green-light"
                />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Display Order:</label>
                <input
                  type="number"
                  value={product.order || 0}
                  onChange={(e) => setProduct(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-transparent"
                />
              </div>
            </div>
          </div>

        <div className="border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-light disabled:opacity-50 font-medium text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}