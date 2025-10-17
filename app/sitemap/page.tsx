import Link from "next/link";

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-light-gray py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-green-dark mb-8 text-center">Sitemap</h1>
        <div className="bg-white rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li><Link href="/" className="text-brand-green hover:text-brand-green-dark">Home</Link></li>
                <li><Link href="/about" className="text-brand-green hover:text-brand-green-dark">About Us</Link></li>
                <li><Link href="/products" className="text-brand-green hover:text-brand-green-dark">Products</Link></li>
                <li><Link href="/contact" className="text-brand-green hover:text-brand-green-dark">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Other Pages</h2>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-brand-green hover:text-brand-green-dark">FAQ</Link></li>
                <li><Link href="/privacy-policy" className="text-brand-green hover:text-brand-green-dark">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="text-brand-green hover:text-brand-green-dark">Terms & Conditions</Link></li>
                <li><Link href="/service-center" className="text-brand-green hover:text-brand-green-dark">Service Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}