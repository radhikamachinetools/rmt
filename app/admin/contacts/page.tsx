"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, User, Grid, List, Trash2 } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  company?: string;
  status?: string;
  createdAt: string;
};

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState<{show: boolean, contactId: string, contactName: string, newStatus: string}>({show: false, contactId: '', contactName: '', newStatus: ''});
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, contactId: string, contactName: string}>({show: false, contactId: '', contactName: ''});

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

  const confirmStatusUpdate = (id: string, name: string, status: string) => {
    setConfirmModal({show: true, contactId: id, contactName: name, newStatus: status});
  };

  const updateStatus = async () => {
    const { contactId, newStatus } = confirmModal;
    setConfirmModal({show: false, contactId: '', contactName: '', newStatus: ''});
    
    try {
      const res = await fetch(`/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setContacts(contacts.map(contact => 
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        ));
        setToast({ message: `Status updated to ${newStatus}!`, type: 'success' });
      } else {
        setToast({ message: 'Failed to update status', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error updating status', type: 'error' });
    }
    
    setTimeout(() => setToast(null), 3000);
  };

  const confirmDelete = (id: string, name: string) => {
    setDeleteModal({show: true, contactId: id, contactName: name});
  };

  const deleteContact = async () => {
    const { contactId } = deleteModal;
    setDeleteModal({show: false, contactId: '', contactName: ''});
    
    try {
      const res = await fetch(`/api/contact/${contactId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
        setToast({ message: 'Contact deleted successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete contact', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error deleting contact', type: 'error' });
    }
    
    setTimeout(() => setToast(null), 3000);
  };

  const filteredContacts = contacts.filter(contact => 
    statusFilter === "all" || contact.status === statusFilter || (!contact.status && statusFilter === "pending")
  );

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-muted mt-1">{filteredContacts.length} of {contacts.length} messages</p>
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm text-brand-green" : "text-gray-500"
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm text-brand-green" : "text-gray-500"
              }`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Mail size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages found</h3>
          <p className="text-muted">Try adjusting your filter criteria</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredContacts.map((contact) => (
            viewMode === "grid" ? (
              <div key={contact.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                  </div>
                  <select
                    value={contact.status || 'pending'}
                    onChange={(e) => confirmStatusUpdate(contact.id, contact.name, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border ${
                      contact.status === 'completed' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => confirmDelete(contact.id, contact.name)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 line-clamp-3">{contact.message}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {contact.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={12} />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
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
                  <div className="flex items-center gap-4">
                    <select
                      value={contact.status || 'pending'}
                      onChange={(e) => confirmStatusUpdate(contact.id, contact.name, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        contact.status === 'completed' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => confirmDelete(contact.id, contact.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
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
            )
          ))}
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.message}
        </div>
      )}

      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 9999}}>
          <div className="bg-brand-green-light rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Update Status</h3>
            <p className="text-white mb-6">
              Are you sure you want to update <strong>{confirmModal.contactName}</strong>'s status to <strong>{confirmModal.newStatus}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal({show: false, contactId: '', contactName: '', newStatus: ''})}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateStatus}
                className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 9999}}>
          <div className="bg-brand-green-light rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Contact</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete <strong>{deleteModal.contactName}</strong>'s message? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({show: false, contactId: '', contactName: ''})}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteContact}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}