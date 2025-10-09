// app/products/page.tsx

import ProductCardClient from "../components/ProductCardClient"; // ✨ Import the new client component

// --- Type Definitions ---
type Product = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
};

// --- Data Fetching Function ---
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:3001/products", {
      cache: "no-store", // Ensures we always get the latest data from the admin panel
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array if there's an error
  }
}

// --- Main Page (Server Component) ---
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-light-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div>
          <h1 className="text-4xl font-extrabold text-center text-brand-green-dark mb-4">
            Our Machinery
          </h1>
          <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Explore our extensive range of high-quality stone processing
            machinery, engineered for performance and reliability.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCardClient
                key={product._id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">
            No products have been added yet. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
}
