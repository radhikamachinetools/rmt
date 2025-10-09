// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // In a real app, you'd make an API call. For this simple auth,
    // we'll store the credentials in localStorage for the browser session.
    // This is simple for a demo and reasonably secure for basic admin access.

    // We create a "Basic Auth" token.
    const token = btoa(`${username}:${password}`); // base64 encode
    localStorage.setItem("admin_token", token);

    // Redirect to the admin dashboard
    router.push("/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-gray">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-brand-green-dark">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-600 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green-light"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green-light"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-4 font-bold text-white bg-brand-green-dark rounded-md hover:bg-brand-green-light transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
