"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, User } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  company?: string;
  createdAt: string;
};

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch {
      console.error('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-muted mt-1">{contacts.length} messages received</p>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Mail size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-muted">Contact form submissions will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    {contact.company && (
                      <p className="text-sm text-gray-500">{contact.company}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  {new Date(contact.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${contact.email}`} className="text-brand-green hover:text-brand-green-dark">
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${contact.phone}`} className="text-brand-green hover:text-brand-green-dark">
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>

              {contact.subject && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Subject: </span>
                  <span className="text-sm text-gray-600">{contact.subject}</span>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}