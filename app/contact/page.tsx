// app/contact/page.tsx

import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-light-gray">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-green-dark to-brand-green text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl lg:text-2xl text-green-100">
              Ready to transform your production? Let&apos;s discuss how we can help you achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl">
              <h2 className="text-3xl font-bold text-brand-green-dark mb-8">
                Send us a Message
              </h2>
              
              <form action="/api/contact" method="POST" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="custom-solution">Custom Solution</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-green text-white font-bold py-4 px-8 rounded-xl hover:bg-brand-green-dark transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {/* Phone */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                      <a 
                        href="tel:+919983813366"
                        className="text-brand-green hover:text-brand-green-dark transition-colors"
                      >
                        +91 9983813366
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                      <a 
                        href="mailto:rmt.jodhpur@gmail.com"
                        className="text-brand-green hover:text-brand-green-dark transition-colors"
                      >
                        rmt.jodhpur@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-brand-green-dark mb-6">Our Locations</h3>
                
                <div className="space-y-6">
                  {/* Unit 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Unit-1 (Main Office)</h4>
                      <p className="text-muted">
                        Plot No. 06, Ram Nagar, Sangriya, Jodhpur, Rajasthan, India
                      </p>
                    </div>
                  </div>

                  {/* Unit 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Unit-2 (Manufacturing)</h4>
                      <p className="text-muted">
                        J-65, RIICO, 1st Phase, Sangriya, Jodhpur, Rajasthan, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center">
                    <Clock className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-green-dark">Business Hours</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Monday - Friday</span>
                    <span className="font-semibold text-brand-green">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Saturday</span>
                    <span className="font-semibold text-brand-green">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Sunday</span>
                    <span className="text-red-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-green-dark mb-4">
              Find Us on Map
            </h2>
            <p className="text-muted">
              Visit our manufacturing facilities in Jodhpur, Rajasthan
            </p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-gray-500">Interactive map will be integrated here</p>
          </div>
        </div>
      </section>
    </div>
  );
}