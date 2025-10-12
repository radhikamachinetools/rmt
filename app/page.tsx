// app/page.tsx
import Image from "next/image";
import { ShieldCheck, Wrench, Trophy } from "lucide-react";

// --- Import all your new Client Components ---
import HeroClient from "./components/HeroClient";
import FeatureCardClient from "./components/FeatureCardClient";
import ProductCardClient from "./components/ProductCardClient";

// --- Type Definitions ---
type MediaItem = {
  url: string;
  resource_type: "image" | "video";
};

type Product = {
  order: number;
  isFeatured: unknown;
  _id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  shortDescription: string;
  category: string;
};

// --- Data Fetching Functions ---
async function getMedia(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/media`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const media = await res.json();
    return Array.isArray(media) ? media : [];
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const allProducts: Product[] = data.success ? data.products : [];

    return allProducts
      .filter((p) => p.isFeatured)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

// --- Main Page (Server Component) ---
export default async function HomePage() {
  const mediaItems = await getMedia();
  const featuredProducts = await getFeaturedProducts();

  const mainVideo = mediaItems.find((item) => item.resource_type === "video");
  const galleryImages = mediaItems.filter(
    (item) => item.resource_type === "image"
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full flex items-center justify-center text-white">
        <Image
          src="/images/sdp-img-2.png"
          alt="Heavy machinery"
          fill
          className="object-cover brightness-50"
          priority
        />
        <HeroClient />
      </section>

      {/* Factory Media Gallery Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-brand-green-dark">
            A Glimpse Into Our Factory
          </h2>
          {mainVideo && (
            <div className="mb-8 sm:mb-12 rounded-lg overflow-hidden shadow-2xl max-w-6xl mx-auto">
              <video
                src={mainVideo.url}
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover aspect-video"
              />
            </div>
          )}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {galleryImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-lg overflow-hidden shadow-lg aspect-square ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
                >
                  <Image
                    src={image.url}
                    alt={`Factory image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
          {!mainVideo && galleryImages.length === 0 && (
            <p className="text-center text-gray-500">
              No factory media has been uploaded yet.
            </p>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-light-gray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-brand-green-dark">
            Our Flagship Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCardClient
                key={product._id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* "Why Choose Us" Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-brand-green-dark">
            Why Radhika Machineries?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCardClient
              icon={<Trophy size={48} />}
              title="Industry Leaders"
            >
              Decades of experience in designing and manufacturing
              high-performance stone processing machinery.
            </FeatureCardClient>
            <FeatureCardClient
              icon={<ShieldCheck size={48} />}
              title="Unmatched Durability"
            >
              Our machines are built with the highest quality materials to
              withstand the toughest industrial environments.
            </FeatureCardClient>
            <FeatureCardClient
              icon={<Wrench size={48} />}
              title="Expert Support"
            >
              Comprehensive after-sales support and service to ensure your
              operations run smoothly without interruption.
            </FeatureCardClient>
          </div>
        </div>
      </section>

      {/* Mini Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-brand-green-dark to-brand-green-deeper text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Have a Project in Mind?</h2>
          <p className="max-w-2xl mx-auto mb-8 sm:mb-12 text-gray-300 text-sm sm:text-base">
            Let&apos;s talk about how Radhika Machineries can help you achieve
            your production goals. Get in touch with our experts today.
          </p>
          <div className="max-w-xl mx-auto">
            <form action="/api/contact" method="POST" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="p-3 rounded bg-medium-gray border-gray-600 focus:ring-brand-green-light focus:border-brand-green-light text-white placeholder-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="p-3 rounded bg-medium-gray border-gray-600 focus:ring-brand-green-light focus:border-brand-green-light text-white placeholder-gray-400"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="sm:col-span-2 p-3 rounded bg-medium-gray border-gray-600 focus:ring-brand-green-light focus:border-brand-green-light text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="sm:col-span-2 bg-brand-green-light text-white font-bold py-3 px-6 sm:px-8 rounded-full hover:bg-brand-green-dark transition-colors text-sm sm:text-base"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
