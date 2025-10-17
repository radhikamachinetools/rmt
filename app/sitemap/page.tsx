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
                <li><a href="/" className="text-brand-green hover:text-brand-green-dark">Home</a></li>
                <li><a href="/about" className="text-brand-green hover:text-brand-green-dark">About Us</a></li>
                <li><a href="/products" className="text-brand-green hover:text-brand-green-dark">Products</a></li>
                <li><a href="/contact" className="text-brand-green hover:text-brand-green-dark">Contact</a></li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Other Pages</h2>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-brand-green hover:text-brand-green-dark">FAQ</a></li>
                <li><a href="/privacy-policy" className="text-brand-green hover:text-brand-green-dark">Privacy Policy</a></li>
                <li><a href="/terms-and-conditions" className="text-brand-green hover:text-brand-green-dark">Terms & Conditions</a></li>
                <li><a href="/service-center" className="text-brand-green hover:text-brand-green-dark">Service Center</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}