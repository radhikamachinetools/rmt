// app/products/[slug]/page.tsx

import { notFound } from "next/navigation";
import ProductDetailsClient from "./components/ProductDetailsClient";

// --- Type Definition ---
// This should match your backend schema exactly
type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
  description: string;
  keyFeatures: string[];
  specifications: { spec: string; value: string }[];
  galleryUrls: string[];
};

// --- Data Fetching Function ---
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/products/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.success ? data.product : null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// --- Main Page (Server Component) ---
export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await params; // ✨ Add this line to resolve the promise
  const product = await getProduct(resolvedParams.slug);

  // If no product is found for the given slug, show a 404 page
  if (!product) {
    notFound();
  }

  // Pass the fetched data to the client component for rendering
  return <ProductDetailsClient product={product} />;
}
