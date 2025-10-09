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
    const res = await fetch("http://localhost:3001/media", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const media = await res.json();
    // Assuming the NestJS endpoint now returns the correct format
    return Array.isArray(media) ? media : [];
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:3001/products", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const allProducts: Product[] = await res.json();

    // ✨ Filter for featured products and sort by order
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
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-white">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-brand-green-dark">
            A Glimpse Into Our Factory
          </h2>
          {mainVideo && (
            <div className="mb-12 rounded-lg overflow-hidden shadow-2xl max-w-6xl max-h-xl mx-auto">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-lg overflow-hidden shadow-lg aspect-square ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  <Image
                    src={image.url}
                    alt={`Factory image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
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
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-green-dark">
            Our Flagship Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-green-dark">
            Why Radhika Machineries?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="py-20 bg-gradient-to-br from-brand-green-dark to-brand-green-deeper text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-300">
            Let&apos;s talk about how Radhika Machineries can help you achieve
            your production goals. Get in touch with our experts today.
          </p>
          <div className="max-w-xl mx-auto">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="p-3 rounded bg-medium-gray border-gray-600 focus:ring-brand-green-light focus:border-brand-green-light"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="p-3 rounded bg-medium-gray border-gray-600 focus:ring-brand-green-light focus:border-brand-green-light"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="md:col-span-2 p-3 rounded bg-medium-gray border-gray-600 focus:ring-brand-green-light focus:border-brand-green-light"
              />
              <button
                type="submit"
                className="md:col-span-2 bg-brand-green-light text-white font-bold py-3 px-8 rounded-full hover:bg-brand-green-dark transition-colors"
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
