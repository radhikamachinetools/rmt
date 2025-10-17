"use client";

import Link from "next/link";
import { Package, Mail, Image, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    pendingContacts: 0,
    completedContacts: 0,
    totalProducts: 5
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        const contacts = data.contacts;
        setStats({
          totalContacts: contacts.length,
          pendingContacts: contacts.filter((c: {status?: string}) => c.status === 'pending' || !c.status).length,
          completedContacts: contacts.filter((c: {status?: string}) => c.status === 'completed').length,
          totalProducts: 5
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-muted mt-1">Manage your website content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Products</h3>
              <p className="text-sm text-gray-600">Manage machinery products</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/contacts"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Contact Messages</h3>
              <p className="text-sm text-gray-600">View customer inquiries</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/media"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Media</h3>
              <p className="text-sm text-gray-600">Manage images and videos</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-green">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.totalContacts}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.pendingContacts}</div>
            <div className="text-sm text-gray-600">Pending Queries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.completedContacts}</div>
            <div className="text-sm text-gray-600">Completed Queries</div>
          </div>
        </div>
      </div>
    </div>
  );
}