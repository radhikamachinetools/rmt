import { ShieldCheck, Wrench, Trophy, Award, Users, Clock } from "lucide-react";
import Image from "next/image";

export const dynamic = 'force-dynamic';

import HeroClient from "./components/HeroClient";
import FeatureCardClient from "./components/FeatureCardClient";
import ProductCardClient from "./components/ProductCardClient";
import ProductHeroCarousel from "./components/ProductHeroCarousel";
import HomeContactForm from "./components/HomeContactForm";
import WallpaperCarousel from "./components/WallpaperCarousel";
import FlagshipProducts from "./components/FlagshipProducts";

type Product = {
  order: number;
  isFeatured: boolean;
  _id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  shortDescription: string;
  category: string;
  features?: string[];
  specifications?: any;
  status?: string;
};

type Certificate = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  status: string;
};

type InfrastructureItem = {
  _id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
  order: number;
};

async function getAllProducts(): Promise<Product[]> {
  try {
    const { connectToDatabase } = await import('./lib/db');
    const { db } = await connectToDatabase();
    const products = await db.collection('rmt_products')
      .find({ status: { $ne: 'inactive' } })
      .sort({ order: 1 })
      .toArray();
    return products as unknown as Product[];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getInfrastructure(): Promise<InfrastructureItem[]> {
  try {
    const { connectToDatabase } = await import('./lib/db');
    const { db } = await connectToDatabase();
    const items = await db.collection('rmt_infrastructure')
      .find({})
      .sort({ order: 1 })
      .toArray();
    return items as unknown as InfrastructureItem[];
  } catch (error) {
    console.error('Failed to fetch infrastructure:', error);
    return [];
  }
}

async function getCertificates(): Promise<Certificate[]> {
  try {
    const { connectToDatabase } = await import('./lib/db');
    const { db } = await connectToDatabase();
    const certificates = await db.collection('rmt_certificates')
      .find({ status: 'active' })
      .sort({ displayOrder: 1 })
      .toArray();
    return certificates as unknown as Certificate[];
  } catch (error) {
    console.error('Failed to fetch certificates:', error);
    return [];
  }
}

export default async function HomePage() {
  const [allProducts, certificates, infrastructure] = await Promise.all([
    getAllProducts(),
    getCertificates(),
    getInfrastructure()
  ]);

  return (
    <div className="overflow-hidden">

      {/* Wallpaper Carousel Section */}
      <WallpaperCarousel />

      {/* Flagship Products Section */}
      <FlagshipProducts />

      <section className="py-8 lg:py-24 bg-white">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 lg:mb-4 text-brand-green-dark">
              Our Infrastructure
            </h2>
            <p className="text-base lg:text-lg text-muted max-w-3xl mx-auto">
              State-of-the-art facilities and advanced manufacturing capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {infrastructure.slice(0, 4).map((item) => (
              <div key={item._id} className="bg-gray-100 rounded-xl aspect-video overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls
                    muted
                  />
                )}
              </div>
            ))}
            {infrastructure.length === 0 && (
              <>
                <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center shadow-lg">
                  <p className="text-gray-500">Infrastructure Video 1</p>
                </div>
                <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center shadow-lg">
                  <p className="text-gray-500">Infrastructure Video 2</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-24 bg-white">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 lg:mb-4 text-brand-green-dark">
              Our Factory in Action
            </h2>
            <p className="text-base lg:text-lg text-muted max-w-3xl mx-auto">
              Take a look inside our state-of-the-art manufacturing facility
            </p>
          </div>
          <div className="relative h-64 lg:h-96 bg-gray-900 overflow-hidden">
            <Image
              src="/images/wallpaper1.jpeg"
              alt="Radhika Machine Tools Factory"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-6 text-white">
              <h3 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">Advanced Manufacturing Facility</h3>
              <p className="text-xs lg:text-sm text-gray-200">State-of-the-art equipment and precision engineering for superior quality machines</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-24 bg-light-gray">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 lg:mb-4 text-brand-green-dark">
              Certificates
            </h2>
            <p className="text-base lg:text-lg text-muted max-w-3xl mx-auto">
              Quality certifications and industry recognitions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
            {certificates.map((certificate) => (
              <div key={certificate._id} className="bg-white shadow-md overflow-hidden aspect-square" style={{border: '1px solid #00786f', borderRadius: '8px'}}>
                <img
                  src={certificate.imageUrl}
                  alt="Certificate"
                  className="w-full h-full object-contain p-1 md:p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-24 bg-light-gray">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 lg:mb-4 text-brand-green-dark">
              Why Radhika Machine Tools?
            </h2>
            <p className="text-base lg:text-lg text-muted max-w-3xl mx-auto">
              We combine decades of expertise with cutting-edge technology to deliver unmatched quality
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-10">
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