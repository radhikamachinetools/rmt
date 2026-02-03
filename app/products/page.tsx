"use client";

import ProductCardClient from "../components/ProductCardClient";
import { Filter } from "lucide-react";
import { useState, useEffect } from "react";

type Product = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
  status?: string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  status: string;
  displayOrder: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        const activeProducts = productsData.products?.filter((p: Product) => p.status !== 'inactive') || [];
        const activeCategories = categoriesData.categories
          ?.filter((c: Category) => c.status === 'active')
          ?.sort((a: Category, b: Category) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [];
        
        setProducts(activeProducts);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  // Group products by category using category names
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = products.filter(product => product.category === category.name);
    return acc;
  }, {} as Record<string, Product[]>);

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
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {categories.map((category) => {
                const productCount = productsByCategory[category.name]?.length || 0;
                return (
                  <a 
                    key={category._id} 
                    href={`#${category.slug}`}
                    className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <span className="text-green-100 font-medium">{category.name}</span>
                    <span className="ml-2 bg-brand-accent text-brand-green-dark text-xs px-2 py-1 rounded-full font-bold">
                      {productCount}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="px-0">
          {products.length > 0 ? (
            <div className="space-y-16">
              {categories.map((category) => {
                const categoryProducts = productsByCategory[category.name] || [];
                if (categoryProducts.length === 0) return null;
                
                return (
                  <div key={category._id} className="space-y-8" id={category.slug}>
                    <div className="space-y-6">
                      {categoryProducts.map((product, index) => (
                        <div key={product._id} className="bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                          <div className="flex flex-col lg:flex-row">
                            {/* Product Image - Left Side */}
                            <div className="lg:w-1/3">
                              <div className="relative aspect-square lg:aspect-[4/3]">
                                <img
                                  src={product.imageUrl || '/images/wallpaper1.jpeg'}
                                  alt={product.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                  <span className="bg-brand-green text-white px-3 py-1 rounded-full text-xs font-medium">
                                    {product.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Product Details - Right Side */}
                            <div className="lg:w-2/3 p-6 lg:p-8">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{product.name}</h3>
                                  <div className="flex items-center gap-4">
                                    <span className="text-brand-green-dark font-semibold">{category.name}</span>
                                    <span className="text-gray-500 text-sm">
                                      {categoryProducts.length} {categoryProducts.length === 1 ? 'machine' : 'machines'} available
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Key Features */}
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-brand-green-dark mb-3 uppercase tracking-wide">Key Features</h4>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <span className="text-brand-green mt-1">•</span>
                                    <span>High Performance & Precision Engineering</span>
                                  </li>
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <span className="text-brand-green mt-1">•</span>
                                    <span>Durable Construction with Premium Materials</span>
                                  </li>
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <span className="text-brand-green mt-1">•</span>
                                    <span>Easy Operation & Maintenance</span>
                                  </li>
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <span className="text-brand-green mt-1">•</span>
                                    <span>24/7 Technical Support Available</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                  href={`/products/${product.slug}`}
                                  className="bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green-dark transition-colors text-center font-semibold flex items-center justify-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Details
                                </a>
                                <a
                                  href="/contact"
                                  className="border-2 border-brand-green text-brand-green px-6 py-3 rounded-lg hover:bg-brand-green hover:text-white transition-colors text-center font-semibold flex items-center justify-center gap-2"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  Get Quote
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
        <div className="px-0 text-center">
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