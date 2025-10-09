// app/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-green-dark mb-4">
        Welcome, Admin!
      </h1>
      <p className="text-gray-600">
        Select an option from the sidebar to manage your website content.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-dark-gray">Manage Products</h2>
          <p className="text-gray-500 mt-2">
            Add, edit, or delete machinery from your catalog.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-dark-gray">Manage Media</h2>
          <p className="text-gray-500 mt-2">
            Upload factory photos and videos for the homepage.
          </p>
        </div>
      </div>
    </div>
  );
}
