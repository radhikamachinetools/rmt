import ProductCardClient from "../components/ProductCardClient";
import { Search, Filter } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';

type Product = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
};

async function getProducts(): Promise<Product[]> {
  try {
    const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(productsByCategory);

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-gradient-to-br from-brand-green-dark to-brand-green text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Our Machinery Collection
            </h1>
            <p className="text-xl lg:text-2xl text-green-100 mb-8">
              Explore our extensive range of high-quality stone processing
              machinery, engineered for performance and reliability.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="space-y-16">
              {categories.map((category) => (
                <div key={category} className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-brand-green-dark mb-4">
                      {category}
                    </h2>
                    <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {productsByCategory[category].map((product, index) => (
                      <ProductCardClient
                        key={product._id}
                        product={product}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Filter size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Products Available
              </h3>
              <p className="text-muted text-lg max-w-md mx-auto">
                No products have been added yet. Please check back later or contact us for more information.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-brand-green-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            We specialize in custom machinery solutions. Let us know your requirements
            and we&apos;ll build the perfect machine for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-brand-accent text-brand-green-dark font-bold py-4 px-8 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
            >
              Request Custom Quote
            </a>
            <a
              href="tel:+919983813366"
              className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white hover:text-brand-green-dark transition-all duration-300"
            >
              Call Now: +91 9983813366
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}