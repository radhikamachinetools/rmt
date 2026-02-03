"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Package, Mail, Image, LogOut, FolderOpen, Award, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-white shadow-sm p-3 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white shadow-sm lg:min-h-screen`}>
          <div className="hidden lg:block p-4">
            <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
          </div>
          <nav className="mt-2 lg:mt-4">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm ${
                pathname === '/admin' ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Package size={16} />
              Dashboard
            </Link>
            <Link
              href="/admin/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm ${
                pathname.startsWith('/admin/categories') ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <FolderOpen size={16} />
              Categories
            </Link>
            <Link
              href="/admin/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm ${
                pathname.startsWith('/admin/products') ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Package size={16} />
              Products
            </Link>
            <Link
              href="/admin/contacts"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm ${
                pathname === '/admin/contacts' ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Mail size={16} />
              Contacts
            </Link>
            <Link
              href="/admin/certificates"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm ${
                pathname.startsWith('/admin/certificates') ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Award size={16} />
              Certificates
            </Link>
            <Link
              href="/admin/gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm ${
                pathname.startsWith('/admin/gallery') ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Image size={16} />
              Gallery
            </Link>
            <Link
              href="/admin/media"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm ${
                pathname === '/admin/media' ? 'bg-brand-green text-white hover:bg-brand-green' : ''
              }`}
            >
              <Image size={16} />
              Media
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-3 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}