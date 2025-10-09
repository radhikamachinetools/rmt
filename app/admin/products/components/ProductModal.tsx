// app/admin/products/components/ProductModal.tsx
"use client";

import { deleteMedia, uploadFiles } from "@/app/lib/api";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --- Type Definitions ---
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
};

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Product) => void;
  productToEdit?: Product | null;
};

// --- Initial State ---
const initialFormData: Product = {
  name: "",
  slug: "",
  category: "",
  imageUrl: "",
  shortDescription: "",
  description: "",
  keyFeatures: [""],
  specifications: [{ spec: "", value: "" }],
  galleryUrls: [],
  isFeatured: false,
  order: 0,
};

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>(initialFormData);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        keyFeatures: productToEdit.keyFeatures?.length
          ? productToEdit.keyFeatures
          : [""],
        specifications: productToEdit.specifications?.length
          ? productToEdit.specifications
          : [{ spec: "", value: "" }],
        galleryUrls: productToEdit.galleryUrls || [],
      });
    } else {
      setFormData(initialFormData);
    }
    // Reset file inputs when modal opens/changes
    setMainImageFile(null);
    setGalleryFiles([]);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveGalleryUrl = async (urlToRemove: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this gallery item? This will delete the file permanently."
      )
    )
      return;
    try {
      const filename = urlToRemove.split("/").pop();
      if (filename) {
        await deleteMedia("products", filename);
      }
    } catch (error) {
      console.error(
        "Failed to delete file from server, but removing from list.",
        error
      );
    }
    setFormData((prev) => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((url) => url !== urlToRemove),
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
    }
  };

  const handleRemoveMainImage = () => {
    // Note: This only removes it from the frontend.
    // The actual file deletion happens when the form is saved if the URL is no longer present.
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setMainImageFile(null);
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  const handleKeyFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, keyFeatures: newFeatures }));
  };

  const addKeyFeature = () => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, ""],
    }));
  };

  const removeKeyFeature = (index: number) => {
    const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, keyFeatures: newFeatures }));
  };

  const handleSpecChange = (
    index: number,
    field: keyof Specification,
    value: string
  ) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { spec: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalData = { ...formData };

    try {
      const filesToUpload: File[] = [];
      if (mainImageFile) filesToUpload.push(mainImageFile);
      if (galleryFiles.length > 0) filesToUpload.push(...galleryFiles);

      if (filesToUpload.length > 0) {
        const uploadedUrls: string[] = await uploadFiles(
          filesToUpload,
          "products"
        );

        if (mainImageFile) {
          finalData.imageUrl = uploadedUrls.shift();
        }
        if (galleryFiles.length > 0) {
          const existingUrls = finalData.galleryUrls.filter((url) => url);
          finalData.galleryUrls = [...existingUrls, ...uploadedUrls];
        }
      }

      onSave(finalData);
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- JSX ---
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-brand-green-dark">
          {productToEdit ? "Edit Product" : "Create New Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Main Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Slug
              </label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* ✨ UPDATED: Main Image Section */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Main Image
              </label>
              {formData.imageUrl ? (
                <div className="flex items-center gap-4">
                  <img
                    src={formData.imageUrl}
                    alt="Current main"
                    className="h-24 w-24 object-cover rounded-lg border"
                  />
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveMainImage}
                      className="text-sm bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No main image set.</p>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleMainImageChange}
                className="hidden" // The input is hidden and triggered by the 'Change' button
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Display Order
              </label>
              <input
                name="order"
                type="number"
                value={formData.order || 0}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <label className="flex items-center gap-2 text-gray-700 font-bold">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
                className="w-5 h-5"
              />
              Show as a &quot;Featured Product&quot; on the homepage
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={2}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          {/* Key Features */}
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <label className="block text-gray-700 text-lg font-bold mb-3">
              Key Features
            </label>
            {formData.keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  value={feature}
                  onChange={(e) =>
                    handleKeyFeatureChange(index, e.target.value)
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeKeyFeature(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addKeyFeature}
              className="mt-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add Feature
            </button>
          </div>

          {/* Specifications */}
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <label className="block text-gray-700 text-lg font-bold mb-3">
              Specifications
            </label>
            {formData.specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                <input
                  value={spec.spec}
                  onChange={(e) =>
                    handleSpecChange(index, "spec", e.target.value)
                  }
                  placeholder="e.g., Blade Diameter"
                  className="p-2 border rounded"
                />
                <div className="flex items-center gap-2">
                  <input
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecChange(index, "value", e.target.value)
                    }
                    placeholder="e.g., 450-600 mm"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpec}
              className="mt-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add Specification
            </button>
          </div>

          {/* Gallery Upload */}
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <label className="block text-gray-700 text-lg font-bold mb-3">
              Gallery Photos & Videos
            </label>
            <div className="mb-4">
              <p className="text-gray-700 text-sm font-bold mb-2">
                Add New Files:
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleGalleryFilesChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mt-4">
              <p className="text-gray-700 text-sm font-bold mb-2">
                Current Gallery Items:
              </p>
              {formData.galleryUrls?.filter((url) => url).length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.galleryUrls
                    .filter((url) => url)
                    .map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group border"
                      >
                        {url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null ? (
                          <img
                            src={url}
                            alt={`Gallery item ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryUrl(url)}
                            className="text-white text-xs bg-red-600 p-1 rounded-full"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No gallery items yet.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-brand-green-dark text-white rounded hover:bg-brand-green-light disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
