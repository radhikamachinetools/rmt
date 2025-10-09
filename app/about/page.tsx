// app/about/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gem, Lightbulb, Handshake, Target } from "lucide-react";
import { ReactNode } from "react";

// A reusable card for our values
const ValueCard = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-brand-green-light">
    <div className="flex justify-center items-center mb-4 text-brand-green-dark">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-dark-gray mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

export default function AboutUsPage() {
  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="relative h-[60vh] w-full flex items-center justify-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/images/about-us-bg.png"
          alt="Radhika Machineries Workshop"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
            About Us
          </h1>
          <p className="text-lg md:text-xl mt-4 drop-shadow-md">
            Our Legacy of Precision Engineering
          </p>
        </div>
      </motion.section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-brand-green-dark mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Forging the Future of the Stone Industry Since 1990
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to Radhika Machineries, a name synonymous with strength,
            precision, and innovation in stone processing technology. For over
            three decades, we have been at the forefront of the industry,
            delivering robust and reliable machinery that empowers our clients
            to achieve unparalleled results. Our journey began with a simple
            mission: to build machines that not only meet but exceed the
            demanding standards of the global stone industry.
          </motion.p>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-brand-green-dark">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard icon={<Gem size={48} />} title="Unwavering Quality">
              Every machine is a testament to our commitment to excellence,
              built with the finest materials and superior craftsmanship.
            </ValueCard>
            <ValueCard
              icon={<Lightbulb size={48} />}
              title="Continuous Innovation"
            >
              We relentlessly pursue technological advancement to provide our
              clients with the most efficient and cutting-edge solutions.
            </ValueCard>
            <ValueCard
              icon={<Handshake size={48} />}
              title="Customer Partnership"
            >
              Your success is our success. We work closely with our clients to
              provide tailored solutions and dedicated support.
            </ValueCard>
            <ValueCard
              icon={<Target size={48} />}
              title="Precision & Performance"
            >
              Our machinery is engineered for flawless accuracy and peak
              performance, ensuring maximum productivity for your operations.
            </ValueCard>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-brand-green-dark to-brand-green-deeper text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Production?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-200">
            Explore our full range of machinery or get in touch with our team to
            discuss your specific needs. Let&apos;s build the future together.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="bg-brand-green-light text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:text-brand-green-dark transition-all duration-300"
            >
              View Our Machines
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-brand-green-light text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-green-light transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
