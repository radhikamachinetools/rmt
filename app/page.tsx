import Image from "next/image";
import { ShieldCheck, Wrench, Trophy, Award, Users, Clock } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';

import HeroClient from "./components/HeroClient";
import FeatureCardClient from "./components/FeatureCardClient";
import ProductCardClient from "./components/ProductCardClient";
import HomeContactForm from "./components/HomeContactForm";
import MediaSlider from "./components/MediaSlider";

type Product = {
  order: number;
  isFeatured: boolean;
  _id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  shortDescription: string;
  category: string;
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const { products } = JSON.parse(data);
    
    return products
      .filter((p: Product) => p.isFeatured)
      .sort((a: Product, b: Product) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="overflow-hidden">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
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

      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-green-dark">
              Our Factory in Action
            </h2>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Take a look inside our state-of-the-art manufacturing facility
            </p>
          </div>
          <MediaSlider />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-light-gray">
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

      <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-light text-white relative overflow-hidden">
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

          <HomeContactForm />
        </div>
      </section>
    </div>
  );
}