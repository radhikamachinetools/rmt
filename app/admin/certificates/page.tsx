"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save, X, Upload } from "lucide-react";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useToast } from "../../components/ToastProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { LoadingButton } from "../../components/ui/loading-button";

type Certificate = {
  _id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
  status: "active" | "inactive";
};

export default function CertificatesAdmin() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, certificateId: string, certificateName: string}>({show: false, certificateId: '', certificateName: ''});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    displayOrder: 1,
    status: "active" as "active" | "inactive",
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      console.log('Fetching certificates...');
      const res = await fetch("/api/certificates");
      const data = await res.json();
      console.log('Certificates response:', data);
      if (data.success) {
        setCertificates(data.certificates || []);
      } else {
        console.error('Failed to fetch certificates:', data);
        setCertificates([]);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      displayOrder: 1,
      status: "active",
    });
    setEditingCertificate(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingCertificate ? `/api/certificates/${editingCertificate._id}` : '/api/certificates';
      const method = editingCertificate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        showToast(
          `Certificate ${editingCertificate ? 'updated' : 'created'} successfully!`,
          'success'
        );
        fetchCertificates();
        resetForm();
      } else {
        showToast(data.error || 'Failed to save certificate', 'error');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error saving certificate', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string, title: string) => {
    setDeleteModal({show: true, certificateId: id, certificateName: title || 'Untitled Certificate'});
  };

  const deleteCertificate = async () => {
    const id = deleteModal.certificateId;
    setDeleting(true);

    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showToast('Certificate deleted successfully!', 'success');
        fetchCertificates();
      } else {
        showToast(data.error || 'Failed to delete certificate', 'error');
      }
    } catch (error) {
      showToast('Error deleting certificate', 'error');
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, certificateId: '', certificateName: ''});
    }
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCertificate(cert);
    setFormData({
      title: cert.title || "",
      description: cert.description || "",
      imageUrl: cert.imageUrl,
      displayOrder: cert.displayOrder,
      status: cert.status
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("files", file);
      fd.append("type", "certificate");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (data?.paths?.[0]) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.paths[0],
        }));
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast('Failed to upload image', 'error');
      }
    } catch (error) {
      showToast('Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <ConfirmationModal
        key={`delete-${deleteModal.certificateId}`}
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({show: false, certificateId: '', certificateName: ''})}
        onConfirm={deleteCertificate}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${deleteModal.certificateName}"? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete Certificate"}
        type="delete"
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Certificate Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all duration-200 text-sm"
                placeholder="Enter certificate title"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all duration-200 text-sm"
                placeholder="Enter certificate description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Certificate Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="certificate-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="certificate-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center space-y-2 ${uploading ? 'opacity-50' : ''}`}
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload certificate image'}
                  </span>
                </label>
                
                {formData.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={formData.imageUrl}
                      alt="Certificate preview"
                      className="max-h-32 mx-auto object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as "active" | "inactive"})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all duration-200 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all duration-200 text-sm"
                min="1"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <LoadingButton
                type="submit"
                loading={saving}
                variant="primary"
                size="md"
                disabled={!formData.imageUrl}
              >
                {editingCertificate ? 'Update Certificate' : 'Create Certificate'}
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificates Management</h1>
          <p className="text-muted mt-1">{certificates.length} certificates</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green-dark transition-all duration-200 shadow-sm font-medium hover:scale-[0.98] active:scale-[0.96]"
        >
          <Plus size={20} />
          Add Certificate
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-muted mb-6">Get started by adding your first certificate</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green-dark transition-colors"
          >
            <Plus size={20} />
            Add Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title || 'Certificate'}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Upload size={32} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      cert.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cert.status}
                  </span>
                  <span className="text-xs text-gray-500">Order: {cert.displayOrder}</span>
                </div>

                {cert.title && (
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{cert.title}</h3>
                )}
                
                {cert.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cert.description}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(cert._id, cert.title || 'Certificate')}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}