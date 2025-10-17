import Image from "next/image";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { promises as fs } from 'fs';
import path from 'path';
import ProductImageGallery from "./components/ProductImageGallery";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  images?: string[];
  keyFeatures?: string[];
  specifications?: Array<{spec: string; value: string}> | {
    power?: string;
    capacity?: string;
    weight?: string;
  };
};

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    return products.find((p: Product) => p.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-brand-green hover:text-brand-green-dark">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const allImages = product.images || [product.imageUrl];

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark mb-8"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery images={allImages} productName={product.name} />

          <div className="space-y-6">
            <div>
              <span className="text-brand-green font-medium">{product.category}</span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <p className="text-xl text-gray-600 mt-4">{product.shortDescription}</p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>{product.description}</p>
            </div>

            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.keyFeatures.filter(feature => feature.trim()).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-brand-green mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.isArray(product.specifications) ? (
                    product.specifications.filter(spec => spec.spec && spec.value).map((spec, index) => (
                      <div key={index}>
                        <span className="text-sm text-gray-500">{spec.spec}</span>
                        <p className="font-semibold">{spec.value}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      {product.specifications.power && (
                        <div>
                          <span className="text-sm text-gray-500">Power</span>
                          <p className="font-semibold">{product.specifications.power}</p>
                        </div>
                      )}
                      {product.specifications.capacity && (
                        <div>
                          <span className="text-sm text-gray-500">Capacity</span>
                          <p className="font-semibold">{product.specifications.capacity}</p>
                        </div>
                      )}
                      {product.specifications.weight && (
                        <div>
                          <span className="text-sm text-gray-500">Weight</span>
                          <p className="font-semibold">{product.specifications.weight}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-brand-green to-brand-green-dark text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Interested in this machine?</h3>
              <p className="mb-6">Get in touch with our experts for pricing and customization options.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+919983813366"
                  className="flex items-center justify-center gap-2 bg-white text-brand-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Phone size={20} />
                  Call Now
                </a>
                <a
                  href="mailto:rmt.jodhpur@gmail.com"
                  className="flex items-center justify-center gap-2 bg-brand-green-deeper text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors"
                >
                  <Mail size={20} />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}