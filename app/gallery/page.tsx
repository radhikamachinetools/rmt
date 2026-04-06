import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from '../lib/db';

export const dynamic = 'force-dynamic';

type GalleryCategory = {
  _id: string;
  name: string;
  slug: string;
  headerImage: string;
  displayOrder: number;
};

type GalleryItem = {
  _id: string;
  categoryId: string;
  type: "image" | "video";
  url: string;
  title: string;
  displayOrder: number;
};

async function getGalleryData(): Promise<{ categories: GalleryCategory[], items: GalleryItem[] }> {
  try {
    const { db } = await connectToDatabase();
    const [categories, items] = await Promise.all([
      db.collection('rmt_gallery_categories').find({}).sort({ displayOrder: 1 }).toArray(),
      db.collection('rmt_gallery_items').find({}).sort({ displayOrder: 1 }).toArray()
    ]);
    return {
      categories: categories as unknown as GalleryCategory[],
      items: items as unknown as GalleryItem[]
    };
  } catch (error) {
    console.error("Failed to fetch gallery data:", error);
    return { categories: [], items: [] };
  }
}

export default async function GalleryPage() {
  const { categories, items } = await getGalleryData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-brand-green-dark to-brand-green flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-0">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">Our Gallery</h1>
          <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto">
            Explore our manufacturing excellence, quality processes, and successful installations
          </p>
        </div>
      </section>

      {/* Gallery Categories */}
      <section className="py-16 lg:py-24">
        <div className="px-0">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-green-dark">
              Gallery Categories
            </h2>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Browse through different aspects of our operations and expertise
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl text-gray-400">📷</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gallery Coming Soon</h3>
              <p className="text-muted">We&apos;re preparing our gallery content. Please check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const categoryItems = items.filter(item => item.categoryId === category._id);
                const previewImage = categoryItems.find(item => item.type === 'image');
                
                return (
                  <Link
                    key={category._id}
                    href={`/gallery/${category.slug}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-64 bg-gray-200">
                      {category.headerImage || previewImage ? (
                        <Image
                          src={category.headerImage || previewImage?.url || '/images/placeholder.png'}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-4xl">📷</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-green-100 text-sm">
                          {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-green font-medium">View Gallery</span>
                        <svg 
                          className="w-5 h-5 text-brand-green group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-brand-green-dark to-brand-green text-white">
        <div className="px-0 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to See Our Machines in Action?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Contact us to schedule a visit to our facility or request a product demonstration
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-green-dark font-semibold px-8 py-4 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
          >
            Contact Us Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}