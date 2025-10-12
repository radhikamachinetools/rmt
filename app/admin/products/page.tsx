"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);

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
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link 
          href="/admin/products/create"
          className="bg-brand-green-dark text-white px-4 py-2 rounded-lg hover:bg-brand-green-light"
        >
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div key={product._id} className="border rounded-lg p-4">
            {product.image && (
              <Image 
                src={product.image} 
                alt={product.name}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="font-bold text-brand-green-dark">₹{product.price}</p>
            <p className="text-xs text-gray-500">App: {product.applicationName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}