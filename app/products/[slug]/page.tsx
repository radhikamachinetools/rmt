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
    // Fetch all products and find the one with the matching slug
    // For a large-scale app, you'd create a dedicated endpoint like /products/:slug
    const res = await fetch(`http://localhost:3001/products`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const products: Product[] = await res.json();
    return products.find((p) => p.slug === slug) || null;
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
