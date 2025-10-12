"use client";

import { useState, useEffect } from "react";
import { Package, Image as ImageIcon, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    media: 0,
    featuredProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, mediaRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/media')
      ]);
      
      const productsData = await productsRes.json();
      const mediaData = await mediaRes.json();
      
      const products = productsData.success ? productsData.products : [];
      const media = Array.isArray(mediaData) ? mediaData : [];
      
      setStats({
        products: products.length,
        media: media.length,
        featuredProducts: products.filter((p: any) => p.isFeatured).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, href, color }: any) => (
    <Link href={href} className={`block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : value}
          </p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome to your admin panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={<Package size={24} className="text-blue-600" />}
          href="/admin/products"
          color="hover:border-blue-200"
        />
        
        <StatCard
          title="Media Files"
          value={stats.media}
          icon={<ImageIcon size={24} className="text-green-600" />}
          href="/admin/media"
          color="hover:border-green-200"
        />
        
        <StatCard
          title="Featured Products"
          value={stats.featuredProducts}
          icon={<TrendingUp size={24} className="text-purple-600" />}
          href="/admin/products"
          color="hover:border-purple-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/products/create"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Package size={20} />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ImageIcon size={20} />
              <span>Upload Media</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">File Upload</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}