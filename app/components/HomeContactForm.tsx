"use client";

import { useState } from "react";

export default function HomeContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        const form = e.target as HTMLFormElement;
        form.reset();
        setMessage("Message sent successfully! We'll get back to you soon.");
        setMessageType("success");
      } else {
        setMessage(result.error || "Failed to send message");
        setMessageType("error");
      }
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 4000);
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage("Failed to send message. Please try again.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
          messageType === "success" 
            ? "bg-green-500 text-white border border-green-400" 
            : "bg-red-500 text-white border border-red-400"
        }`}>
          {messageType === "success" ? "✓ " : "✗ "}{message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300 peer"
            />
            <label className="absolute -top-2 left-3 bg-brand-green px-2 text-xs text-white opacity-0 peer-focus:opacity-100 peer-valid:opacity-100 transition-opacity">Name</label>
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300 peer"
            />
            <label className="absolute -top-2 left-3 bg-brand-green px-2 text-xs text-white opacity-0 peer-focus:opacity-100 peer-valid:opacity-100 transition-opacity">Email</label>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300 peer"
          />
          <label className="absolute -top-2 left-3 bg-brand-green px-2 text-xs text-white opacity-0 peer-focus:opacity-100 peer-valid:opacity-100 transition-opacity">Phone</label>
        </div>
        
        <div className="relative">
          <textarea
            name="message"
            placeholder="Tell us about your requirements..."
            rows={4}
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-green-100 transition-all duration-300 resize-none peer"
          ></textarea>
          <label className="absolute -top-2 left-3 bg-brand-green px-2 text-xs text-white opacity-0 peer-focus:opacity-100 peer-valid:opacity-100 transition-opacity">Message</label>
        </div>
        
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-accent text-brand-green-dark font-bold py-4 px-12 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}