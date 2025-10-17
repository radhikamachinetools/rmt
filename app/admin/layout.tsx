"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Package, Mail, Image, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-auth='));
      
      if (authCookie && authCookie.split('=')[1] === 'true') {
        setIsAuthenticated(true);
      } else if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = 'admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
    </div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                pathname === '/admin' ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Package size={20} />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                pathname.startsWith('/admin/products') ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Package size={20} />
              Products
            </Link>
            <Link
              href="/admin/contacts"
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                pathname === '/admin/contacts' ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Mail size={20} />
              Contacts
            </Link>
            <Link
              href="/admin/media"
              className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                pathname === '/admin/media' ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Image size={20} />
              Media
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 w-full text-left"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}