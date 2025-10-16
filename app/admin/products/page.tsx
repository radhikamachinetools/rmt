"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, Plus, Search, Filter, Grid, List } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  shortDescription?: string;
  description: string;
  category: string;
  price?: number;
  image?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  slug: string;
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch {
      console.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch {
      console.error('Error deleting product');
    }
  };

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p: Product) => p.category))).filter(Boolean);

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-muted mt-1">{filteredProducts.length} of {products.length} products</p>
        </div>
        <Link 
          href="/admin/products/create"
          className="inline-flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300 bg-white min-w-[200px]"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm text-brand-green" : "text-gray-500"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm text-brand-green" : "text-gray-500"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {products.length === 0 ? "No products yet" : "No products found"}
          </h3>
          <p className="text-muted mb-6">
            {products.length === 0 
              ? "Get started by creating your first product" 
              : "Try adjusting your search or filter criteria"
            }
          </p>
          {products.length === 0 && (
            <Link 
              href="/admin/products/create"
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green-dark transition-colors"
            >
              <Plus size={20} />
              Create Product
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredProducts.map((product: Product) => (
            viewMode === "grid" ? (
              <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                  {product.image || product.imageUrl ? (
                    <Image 
                      src={product.image || product.imageUrl || '/images/placeholder.png'} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Eye size={32} />
                    </div>
                  )}
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{product.name}</h3>
                  </div>
                  
                  <p className="text-muted text-sm mb-3 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    {product.price && (
                      <span className="font-bold text-brand-green">₹{product.price}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.image || product.imageUrl ? (
                      <Image 
                        src={product.image || product.imageUrl || '/images/placeholder.png'} 
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Eye size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      {product.isFeatured && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium ml-2">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-muted text-sm line-clamp-2 mb-2">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      {product.price && (
                        <span className="font-bold text-brand-green">₹{product.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}