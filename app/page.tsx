// app/page.tsx
import Image from "next/image";
import { ShieldCheck, Wrench, Trophy, Award, Users, Clock } from "lucide-react";

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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center text-white">
        <Image
          src="/images/sdp-img-2.png"
          alt="Heavy machinery"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <HeroClient />
      </section>

      {/* Factory Media Gallery Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-green-dark">
              A Glimpse Into Our Factory
            </h2>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Experience the precision and craftsmanship that goes into every machine we build
            </p>
          </div>

          {mainVideo && (
            <div className="mb-12 lg:mb-16 rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {galleryImages.slice(0, 8).map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl overflow-hidden shadow-lg group cursor-pointer ${
                    index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                  }`}
                >
                  <div className="aspect-square">
                    <Image
                      src={image.url}
                      alt={`Factory image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!mainVideo && galleryImages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Image width={40} height={40} src="/images/placeholder.png" alt="No media" />
              </div>
              <p className="text-muted text-lg">
                No factory media has been uploaded yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 lg:py-24 bg-light-gray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-green-dark">
              Our Flagship Products
            </h2>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Discover our premium range of stone processing machinery, engineered for excellence
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {featuredProducts.map((product, index) => (
                <ProductCardClient
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Trophy size={40} className="text-gray-400" />
              </div>
              <p className="text-muted text-lg">
                Featured products will be displayed here soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-green-dark">
              Why Radhika Machine Tools?
            </h2>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              We combine decades of expertise with cutting-edge technology to deliver unmatched quality
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <FeatureCardClient
              icon={<Trophy size={48} className="text-brand-green" />}
              title="Industry Leaders"
            >
              Over 25 years of experience in designing and manufacturing
              high-performance stone processing machinery for global markets.
            </FeatureCardClient>
            
            <FeatureCardClient
              icon={<ShieldCheck size={48} className="text-brand-green" />}
              title="Unmatched Durability"
            >
              Our machines are built with premium materials and rigorous testing
              to withstand the toughest industrial environments.
            </FeatureCardClient>
            
            <FeatureCardClient
              icon={<Wrench size={48} className="text-brand-green" />}
              title="Expert Support"
            >
              Comprehensive after-sales support, maintenance services, and technical
              assistance to ensure optimal performance.
            </FeatureCardClient>
            
            <FeatureCardClient
              icon={<Award size={48} className="text-brand-green" />}
              title="Quality Certified"
            >
              ISO certified manufacturing processes and quality control systems
              ensure every machine meets international standards.
            </FeatureCardClient>
            
            <FeatureCardClient
              icon={<Users size={48} className="text-brand-green" />}
              title="Trusted by 500+"
            >
              Serving over 500 satisfied clients worldwide with customized
              solutions for diverse industrial requirements.
            </FeatureCardClient>
            
            <FeatureCardClient
              icon={<Clock size={48} className="text-brand-green" />}
              title="24/7 Service"
            >
              Round-the-clock technical support and emergency service to minimize
              downtime and maximize productivity.
            </FeatureCardClient>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-light text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Ready to Transform Your Production?
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Let&apos;s discuss how Radhika Machine Tools can help you achieve your production goals.
              Get in touch with our experts today.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form action="/api/contact" method="POST" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300 resize-none"
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-brand-accent text-brand-green-dark font-bold py-4 px-12 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}