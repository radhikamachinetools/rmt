"use client";

import Link from "next/link";
import { Package, Mail, Image, BarChart3, Building2, Award } from "lucide-react";
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
    <div className="w-full space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-muted mt-1 text-sm">Manage your website content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <Link
          href="/admin/products"
          className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-brand-green rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Products</h3>
              <p className="text-xs text-gray-600">Manage machinery products</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/contacts"
          className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Contact Messages</h3>
              <p className="text-xs text-gray-600">View customer inquiries</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/infrastructure"
          className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Infrastructure</h3>
              <p className="text-xs text-gray-600">Manage facility images & videos</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/certificates"
          className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Certificates</h3>
              <p className="text-xs text-gray-600">Manage certificates & PDFs</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-brand-green">{stats.totalProducts}</div>
            <div className="text-xs text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-blue-500">{stats.totalContacts}</div>
            <div className="text-xs text-gray-600">Total Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-yellow-500">{stats.pendingContacts}</div>
            <div className="text-xs text-gray-600">Pending Queries</div>
          </div>
          <div className="text-center">
            <div className="text-lg lg:text-xl font-bold text-green-500">{stats.completedContacts}</div>
            <div className="text-xs text-gray-600">Completed Queries</div>
          </div>
        </div>
      </div>
    </div>
  );
}