// app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductModal from "./components/ProductModal"; // ✨ Import the modal
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/app/lib/api";

// Define the type for a single product
type Product = {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  imageUrl?: string;
  shortDescription: string;
  description: string;
  keyFeatures: string[];
  specifications: { spec: string; value: string }[];
  galleryUrls: string[];
  isFeatured?: boolean;
  order?: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Function to fetch and update products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product: Product | null = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = async (productData: Product) => {
    try {
      if (productToEdit && productToEdit._id) {
        // Update existing product
        await updateProduct(productToEdit._id, productData);
      } else {
        // Create new product
        await createProduct(productData);
      }
      handleCloseModal();
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        await fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-green-dark">
          Manage Products
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-green-light transition-colors"
        >
          Create New Product
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-light-gray"
                  >
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => product._id && handleDeleteProduct(product._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No products found. Click the button above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✨ The Modal for creating/editing */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />
    </div>
  );
}
