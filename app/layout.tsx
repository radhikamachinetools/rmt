// app/layout.tsx

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Radhika Machine Tools - Premium Stone Processing Machinery",
    template: "%s | Radhika Machine Tools"
  },
  description: "Leading manufacturer of stone processing machinery including granite cutting machines, line polishing machines, handling cranes, and epoxy resin lines. Trusted by 500+ industries worldwide.",
  keywords: [
    "stone processing machinery",
    "granite cutting machines",
    "line polishing machines",
    "handling cranes",
    "epoxy resin line",
    "stone machinery manufacturer",
    "industrial machinery",
    "Jodhpur machinery",
    "Radhika Machine Tools"
  ],
  authors: [{ name: "Radhika Machine Tools" }],
  creator: "Radhika Machine Tools",
  publisher: "Radhika Machine Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Radhika Machine Tools - Premium Stone Processing Machinery',
    description: 'Leading manufacturer of stone processing machinery. Trusted by 500+ industries worldwide.',
    siteName: 'Radhika Machine Tools',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Radhika Machine Tools - Stone Processing Machinery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radhika Machine Tools - Premium Stone Processing Machinery',
    description: 'Leading manufacturer of stone processing machinery. Trusted by 500+ industries worldwide.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#059669' },
    { media: '(prefers-color-scheme: dark)', color: '#047857' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RMT" />
        <meta name="application-name" content="Radhika Machine Tools" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body className="antialiased">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Radhika Machine Tools",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/images/radhika-logo.png`,
              "description": "Leading manufacturer of stone processing machinery including granite cutting machines, line polishing machines, handling cranes, and epoxy resin lines.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plot No. 06, Ram Nagar, Sangriya",
                "addressLocality": "Jodhpur",
                "addressRegion": "Rajasthan",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9983813366",
                "contactType": "customer service",
                "email": "rmt.jodhpur@gmail.com"
              },
              "sameAs": [
                "https://www.facebook.com/radhikamachinetools",
                "https://www.linkedin.com/company/radhika-machine-tools"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}