"use client";

// Force refresh - Updated at 2024-12-19 10:30:00
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useToast } from "../../components/ToastProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { LoadingButton } from "../../components/ui/loading-button";

type Category = {
  _id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  displayOrder: number;
};

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "active" as "active" | "inactive",
    displayOrder: 0
  });
  const [deleteModal, setDeleteModal] = useState<{show: boolean, categoryId: string, categoryName: string}>({show: false, categoryId: '', categoryName: ''});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const res = await fetch('/api/categories');
      const data = await res.json();
      console.log('Categories response:', data);
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        console.error('Failed to fetch categories:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast(
          `Category ${editingCategory ? 'updated' : 'created'} successfully!`, 
          'success'
        );
        fetchCategories();
        resetForm();
      } else {
        showToast(data.error || 'Failed to save category', 'error');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error saving category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", status: "active", displayOrder: 0 });
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      status: category.status,
      displayOrder: category.displayOrder
    });
    setShowModal(true);
  };

  const confirmDelete = (id: string, name: string) => {
    setDeleteModal({show: true, categoryId: id, categoryName: name});
  };

  const deleteCategory = async () => {
    const id = deleteModal.categoryId;
    setDeleting(true);
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok) {
        showToast('Category deleted successfully!', 'success');
        fetchCategories();
      } else {
        showToast(data.error || 'Failed to delete category', 'error');
      }
    } catch (error) {
      showToast('Error deleting category', 'error');
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, categoryId: '', categoryName: ''});
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
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
        key={`delete-${deleteModal.categoryId}`}
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({show: false, categoryId: '', categoryName: ''})}
        onConfirm={deleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.categoryName}"? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete Category"}
        type="delete"
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all duration-200 text-sm"
                placeholder="Enter category name"
                required
              />
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
                onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all duration-200 text-sm"
                placeholder="0"
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
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-muted mt-1">{filteredCategories.length} of {categories.length} categories</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green-dark transition-all duration-200 shadow-sm font-medium hover:scale-[0.98] active:scale-[0.96]"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {categories.length === 0 ? "No categories yet" : "No categories found"}
          </h3>
          <p className="text-muted mb-6">
            {categories.length === 0 
              ? "Get started by creating your first category" 
              : "Try adjusting your search criteria"
            }
          </p>
          {categories.length === 0 && (
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl hover:bg-brand-green-dark transition-colors"
            >
              <Plus size={20} />
              Create Category
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Slug</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Order</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {category.status === 'active' ? (
                          <Eye size={16} className="text-green-500" />
                        ) : (
                          <EyeOff size={16} className="text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          category.status === 'active' ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {category.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{category.displayOrder}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(category._id, category.name)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}