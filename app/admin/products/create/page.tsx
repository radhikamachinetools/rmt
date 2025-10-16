"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    shortDescription: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    specifications: {
      power: "",
      capacity: "",
      weight: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-6">
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
              <option value="Block Cutting Machines">Block Cutting Machines</option>
              <option value="Line Polishing Machines">Line Polishing Machines</option>
              <option value="Wire Cutting Machines">Wire Cutting Machines</option>
              <option value="Stone Processing Equipment">Stone Processing Equipment</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={product.imageUrl}
            onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            placeholder="/uploads/MACHINES RENDER COLLECTION/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <textarea
            required
            rows={3}
            value={product.shortDescription}
            onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description *
          </label>
          <textarea
            required
            rows={6}
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Power
            </label>
            <input
              type="text"
              value={product.specifications.power}
              onChange={(e) => setProduct({
                ...product,
                specifications: { ...product.specifications, power: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              placeholder="e.g., 75 HP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="text"
              value={product.specifications.capacity}
              onChange={(e) => setProduct({
                ...product,
                specifications: { ...product.specifications, capacity: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              placeholder="e.g., 3000mm x 2000mm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight
            </label>
            <input
              type="text"
              value={product.specifications.weight}
              onChange={(e) => setProduct({
                ...product,
                specifications: { ...product.specifications, weight: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              placeholder="e.g., 15000 kg"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
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

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? "Creating..." : "Create Product"}
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