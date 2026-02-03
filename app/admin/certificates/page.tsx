"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

type Certificate = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string; // ALWAYS IMAGE (pdf converted to image)
  displayOrder: number;
  status: "active" | "inactive";
};

export default function CertificatesAdmin() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const [formData, setFormData] = useState({
    imageUrl: "",
    displayOrder: 1,
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      setCertificates(data.certificates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: "",
      displayOrder: 1,
      status: "active",
    });
    setEditingCertificate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      _id: editingCertificate?._id || `cert-${Date.now()}`,
    };

    await fetch("/api/certificates", {
      method: editingCertificate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchCertificates();
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;

    await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
    fetchCertificates();
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCertificate(cert);
    setFormData(cert);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Certificates</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Certificate
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <p>Loading...</p>
        ) : certificates.length === 0 ? (
          <p>No certificates found</p>
        ) : (
          certificates.map((cert) => (
            <div key={cert._id} className="bg-white shadow rounded overflow-hidden">
              <div className="aspect-square bg-gray-200">
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      cert.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cert.status}
                  </span>

                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(cert)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(cert._id)}>
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingCertificate ? "Edit" : "Add"} Certificate
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-sm mb-1">Certificate Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

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
                    }
                  }}
                />

                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    className="mt-2 h-24 object-contain border"
                  />
                )}
              </div>

              <select
                className="w-full border p-2 rounded"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive",
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded flex justify-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
