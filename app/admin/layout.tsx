// app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

// Sidebar component
const Sidebar = () => {
  const pathname = usePathname();
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/admin/products", label: "Products", icon: <Package /> },
    { href: "/admin/media", label: "Media", icon: <ImageIcon /> },
  ];

  return (
    <aside className="w-64 bg-dark-gray text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-brand-green-light">
        Admin Portal
      </h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${pathname === item.href ? "bg-brand-green-dark" : "hover:bg-medium-gray"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This is a simple client-side check.
    // If we're not on the login page, check for the token.
    if (pathname !== "/admin/login") {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
      }
    }
  }, [pathname, router]);

  // Don't show the layout on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-light-gray">{children}</main>
    </div>
  );
}
