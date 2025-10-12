"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/products", label: "Products", icon: <Package size={20} /> },
    { href: "/admin/media", label: "Media", icon: <ImageIcon size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-dark-gray text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-medium-gray">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-green-light">
              Admin Portal
            </h2>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-medium-gray rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  pathname === item.href 
                    ? "bg-brand-green-dark text-white" 
                    : "hover:bg-medium-gray text-gray-300"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="p-4 border-t border-medium-gray">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-gray-300 hover:bg-medium-gray rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/admin/login") {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
      }
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <div className="w-10" />
          </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
