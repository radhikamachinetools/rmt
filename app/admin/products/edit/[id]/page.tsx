"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import TechnicalTableBuilder from '../../components/TechnicalTableBuilder';

type Category = {
  _id: string;
  name: string;
  slug: string;
  status: string;
};

type ContentSection = {
  heading: string;
  description: string;
  listType: 'bullet' | 'numbered' | 'plain';
  items: string[];
};

type TechnicalTable = {
  headers: string[];
  rows: string[][];
};

type TechnicalSpec = {
  label: string;
  value: string;
};

export default function EditProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    model: "",
    description: "",
    additionalDescriptions: [""] as string[],
    imageUrl: "",
    images: [] as string[],
    isFeatured: false,
    status: "active",
    technicalInfo: [] as TechnicalSpec[],
    technicalTable: {
      headers: ["Model", "Motor Power", "Dimensions", "Weight"],
      rows: []
    } as TechnicalTable,
    technicalInformation: {
      headers: [],
      rows: []
    },
    videos: [] as string[],
    contentSections: [] as ContentSection[]
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchCategories();
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        const productData = data.product;
        setProduct({
          name: productData.name || "",
          category: productData.category || "",
          model: productData.model || "",
          description: productData.description || "",
          additionalDescriptions: productData.additionalDescriptions?.length ? productData.additionalDescriptions : [""],
          imageUrl: productData.imageUrl || "",
          images: productData.images || [],
          isFeatured: productData.isFeatured || false,
          status: productData.status || "active",
          technicalInfo: productData.technicalInfo || [],
          technicalTable: productData.technicalTable || {
            headers: ["Model", "Motor Power", "Dimensions", "Weight"],
            rows: []
          },
          technicalInformation: productData.technicalInformation || {
            headers: [],
            rows: []
          },
          videos: productData.videos || [],
          contentSections: productData.contentSections || []
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDescription = () => {
    setProduct({
      ...product,
      additionalDescriptions: [...product.additionalDescriptions, ""]
    });
  };

  const updateDescription = (index: number, value: string) => {
    const newDescriptions = [...product.additionalDescriptions];
    newDescriptions[index] = value;
    setProduct({
      ...product,
      additionalDescriptions: newDescriptions
    });
  };

  const removeDescription = (index: number) => {
    const newDescriptions = product.additionalDescriptions.filter((_, i) => i !== index);
    setProduct({
      ...product,
      additionalDescriptions: newDescriptions
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories.filter((cat: Category) => cat.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addTechnicalTableColumn = () => {
    setProduct({
      ...product,
      technicalTable: {
        ...product.technicalTable,
        headers: [...product.technicalTable.headers, "New Column"],
        rows: product.technicalTable.rows.map(row => [...row, ""])
      }
    });
  };

  const updateTechnicalTableHeader = (index: number, value: string) => {
    const newHeaders = [...product.technicalTable.headers];
    newHeaders[index] = value;
    setProduct({
      ...product,
      technicalTable: {
        ...product.technicalTable,
        headers: newHeaders
      }
    });
  };

  const removeTechnicalTableColumn = (index: number) => {
    setProduct({
      ...product,
      technicalTable: {
        headers: product.technicalTable.headers.filter((_, i) => i !== index),
        rows: product.technicalTable.rows.map(row => row.filter((_, i) => i !== index))
      }
    });
  };

  const removeTechnicalTableRow = (index: number) => {
    setProduct({
      ...product,
      technicalTable: {
        ...product.technicalTable,
        rows: product.technicalTable.rows.filter((_, i) => i !== index)
      }
    });
  };

  const addTechnicalTableRow = () => {
    setProduct({
      ...product,
      technicalTable: {
        ...product.technicalTable,
        rows: [...product.technicalTable.rows, new Array(product.technicalTable.headers.length).fill("")]
      }
    });
  };

  const updateTechnicalTableCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...product.technicalTable.rows];
    newRows[rowIndex][colIndex] = value;
    setProduct({
      ...product,
      technicalTable: {
        ...product.technicalTable,
        rows: newRows
      }
    });
  };

  const addContentSection = () => {
    setProduct({
      ...product,
      contentSections: [...product.contentSections, {
        heading: "",
        description: "",
        listType: "bullet" as const,
        items: [""]
      }]
    });
  };

  const updateContentSection = (index: number, field: keyof ContentSection, value: any) => {
    const newSections = [...product.contentSections];
    newSections[index] = { ...newSections[index], [field]: value };
    setProduct({
      ...product,
      contentSections: newSections
    });
  };

  const removeContentSection = (index: number) => {
    setProduct({
      ...product,
      contentSections: product.contentSections.filter((_, i) => i !== index)
    });
  };

  const addContentItem = (sectionIndex: number) => {
    const newSections = [...product.contentSections];
    newSections[sectionIndex].items.push("");
    setProduct({
      ...product,
      contentSections: newSections
    });
  };

  const updateContentItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const newSections = [...product.contentSections];
    newSections[sectionIndex].items[itemIndex] = value;
    setProduct({
      ...product,
      contentSections: newSections
    });
  };

  const removeContentItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...product.contentSections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    setProduct({
      ...product,
      contentSections: newSections
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Clean up empty items
      const cleanedProduct = {
        ...product,
        slug,
        additionalDescriptions: product.additionalDescriptions.filter(desc => desc.trim() !== ""),
        technicalInfo: product.technicalInfo.filter(spec => spec.label.trim() !== "" && spec.value.trim() !== ""),
        technicalTable: {
          headers: product.technicalTable.headers.filter(h => h.trim() !== ""),
          rows: product.technicalTable.rows.filter(row => row.some(cell => cell.trim() !== ""))
        },
        videos: product.videos.filter(v => v.trim() !== ""),
        contentSections: product.contentSections.filter(section => 
          section.heading.trim() !== "" && 
          (section.description.trim() !== "" || section.items.some(item => item.trim() !== ""))
        ).map(section => ({
          ...section,
          items: section.items.filter(item => item.trim() !== "")
        }))
      };
      
      // Upload files first
      if (mainImageFile || galleryFiles.length > 0) {
        const formData = new FormData();
        formData.append('slug', slug);
        
        if (mainImageFile) formData.append('files', mainImageFile);
        galleryFiles.forEach(file => formData.append('files', file));
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          const paths = uploadData.paths;
          const updatedProduct = {
            ...cleanedProduct,
            imageUrl: mainImageFile ? paths[0] : product.imageUrl,
            images: galleryFiles.length > 0 ? (mainImageFile ? paths.slice(1) : paths) : product.images
          };
          
          const res = await fetch(`/api/products/${params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
          });
          
          if (res.ok) {
            router.push("/admin/products");
          }
        }
      } else {
        const res = await fetch(`/api/products/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanedProduct),
        });
        
        if (res.ok) {
          router.push("/admin/products");
        }
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setSaving(false);
    }
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Product Info */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                placeholder="e.g., CHALLENGER B-7"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model / Variant
              </label>
              <input
                type="text"
                value={product.model}
                onChange={(e) => setProduct({ ...product, model: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                placeholder="e.g., B-7, G-5, 1300/9/6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={product.status}
                onChange={(e) => setProduct({ ...product, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={6}
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            placeholder="Detailed product description"
          />
          
          {/* Additional Description Fields */}
          {product.additionalDescriptions.map((desc, index) => (
            <div key={index} className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Description {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => removeDescription(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <textarea
                rows={4}
                value={desc}
                onChange={(e) => updateDescription(index, e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                placeholder="Additional product description"
              />
            </div>
          ))}

          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              id="featured"
              checked={product.isFeatured}
              onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
              className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured Product
            </label>
          </div>
        </div>

        {/* Content Sections - Enhanced for Multiple Descriptions */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Content Sections</h2>
            <button
              type="button"
              onClick={addContentSection}
              className="flex items-center gap-2 text-brand-green hover:text-brand-green-dark"
            >
              <Plus size={16} />
              Add Section
            </button>
          </div>
          
          <div className="space-y-8">
            {product.contentSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Section {sectionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeContentSection(sectionIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => updateContentSection(sectionIndex, 'heading', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      placeholder="e.g., FEATURES, OPTIONAL, CONTROL PANEL"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={section.description}
                      onChange={(e) => updateContentSection(sectionIndex, 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                      placeholder="Optional description text"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      List Type
                    </label>
                    <select
                      value={section.listType}
                      onChange={(e) => updateContentSection(sectionIndex, 'listType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    >
                      <option value="bullet">Bullet Points</option>
                      <option value="numbered">Numbered List</option>
                      <option value="plain">Plain Text</option>
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Content Items
                      </label>
                      <button
                        type="button"
                        onClick={() => addContentItem(sectionIndex)}
                        className="text-brand-green hover:text-brand-green-dark text-sm"
                      >
                        <Plus size={14} className="inline mr-1" />
                        Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-3">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateContentItem(sectionIndex, itemIndex, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                            placeholder={`${section.listType === 'numbered' ? `${itemIndex + 1}.` : section.listType === 'bullet' ? '•' : ''} Enter content`}
                          />
                          <button
                            type="button"
                            onClick={() => removeContentItem(sectionIndex, itemIndex)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {product.contentSections.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">No content sections created yet</p>
              <button
                type="button"
                onClick={addContentSection}
                className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green-dark mx-auto"
              >
                <Plus size={16} />
                Add First Section
              </button>
            </div>
          )}
        </div>

        {/* Technical Information Table - New Dynamic System */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <TechnicalTableBuilder
            data={product.technicalInformation}
            onChange={(data) => setProduct({ ...product, technicalInformation: data })}
          />
        </div>

        {/* Product Media */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Media</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMainImageFile(file);
                    const previewUrl = URL.createObjectURL(file);
                    setProduct({ ...product, imageUrl: previewUrl });
                  }
                }}
                className="hidden"
                id="mainImage"
              />
              <label htmlFor="mainImage" className="cursor-pointer">
                {product.imageUrl ? (
                  <div className="space-y-2 relative group">
                    <img src={product.imageUrl} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setProduct({ ...product, imageUrl: "" });
                        setMainImageFile(null);
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images & Videos
            </label>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const imageFiles = files.filter(file => file.type.startsWith('image/'));
                    const videoFiles = files.filter(file => file.type.startsWith('video/'));
                    
                    setGalleryFiles([...galleryFiles, ...imageFiles]);
                    
                    const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
                    const videoUrls = videoFiles.map(file => URL.createObjectURL(file));
                    
                    setProduct({ 
                      ...product, 
                      images: [...product.images, ...imageUrls],
                      videos: [...product.videos, ...videoUrls]
                    });
                  }}
                  className="hidden"
                  id="galleryMedia"
                />
                <label htmlFor="galleryMedia" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl text-gray-400">🎬</span>
                    </div>
                    <p className="text-gray-600">Click to upload images & videos</p>
                    <p className="text-sm text-gray-500">Select multiple files for gallery</p>
                  </div>
                </label>
              </div>
              
              {/* Gallery Preview */}
              {(product.images.length > 0 || product.videos.length > 0) && (
                <div className="space-y-4">
                  {product.images.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Images ({product.images.length})</p>
                      <div className="grid grid-cols-4 gap-2">
                        {product.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img src={img} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = product.images.filter((_, i) => i !== index);
                                const newFiles = galleryFiles.filter((_, i) => i !== index);
                                setProduct({ ...product, images: newImages });
                                setGalleryFiles(newFiles);
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
                  
                  {product.videos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Videos ({product.videos.length})</p>
                      <div className="grid grid-cols-2 gap-2">
                        {product.videos.map((video, index) => (
                          <div key={index} className="relative group">
                            <video src={video} className="w-full h-20 object-cover rounded border" muted />
                            <button
                              type="button"
                              onClick={() => {
                                const newVideos = product.videos.filter((_, i) => i !== index);
                                setProduct({ ...product, videos: newVideos });
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
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}