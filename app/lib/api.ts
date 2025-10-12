// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Basic ${token}` }),
  };
}

// Fetch all products
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    // headers: getAuthHeaders(), //  REMOVE THIS LINE
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Create a new product
export async function createProduct(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

// ✨ Update an existing product
export async function updateProduct(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

// ✨ Delete a product
export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function deleteMedia(folder: string, filename: string) {
  const res = await fetch(`${API_URL}/media/${folder}/${filename}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete media");
  return res.json();
}

export async function uploadFiles(
  files: File[],
  folder: "products" | "factory"
) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  // ✨ Add folder as a query parameter
  const res = await fetch(`${API_URL}/media/upload?folder=${folder}`, {
    method: "POST",
    headers: { ...(token && { Authorization: `Basic ${token}` }) },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload files");
  return res.json();
}

export async function getMedia() {
  const res = await fetch(`${API_URL}/media`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch media");
  return res.json();
}
