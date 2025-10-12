"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching products:', error);
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
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-4 sm:mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="h-32 sm:h-48 bg-gray-200 rounded-lg mb-4"></div>
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{products.length} products total</p>
        </div>
        <Link 
          href="/admin/products/create"
          className="inline-flex items-center justify-center gap-2 bg-brand-green-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-brand-green-light transition-colors shadow-sm font-medium text-sm sm:text-base"
        >
          <Plus size={18} className="sm:hidden" />
          <Plus size={20} className="hidden sm:block" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Plus size={24} className="sm:hidden text-gray-400" />
            <Plus size={32} className="hidden sm:block text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">Get started by creating your first product</p>
          <Link 
            href="/admin/products/create"
            className="inline-flex items-center gap-2 bg-brand-green-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-brand-green-light transition-colors text-sm sm:text-base"
          >
            <Plus size={18} className="sm:hidden" />
            <Plus size={20} className="hidden sm:block" />
            Create Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="relative h-32 sm:h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                {product.image || product.imageUrl ? (
                  <Image 
                    src={product.image || product.imageUrl} 
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Eye size={24} className="sm:hidden" />
                    <Eye size={32} className="hidden sm:block" />
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs sm:text-sm text-gray-500 truncate">{product.category}</span>
                  {product.price && (
                    <span className="font-bold text-brand-green-dark text-sm sm:text-base">₹{product.price}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye size={14} className="sm:hidden" />
                    <Eye size={16} className="hidden sm:block" />
                    <span className="hidden sm:inline">View</span>
                  </Link>
                  <Link
                    href={`/admin/products/edit/${product._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Pencil size={14} className="sm:hidden" />
                    <Pencil size={16} className="hidden sm:block" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={14} className="sm:hidden" />
                    <Trash2 size={16} className="hidden sm:block" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}