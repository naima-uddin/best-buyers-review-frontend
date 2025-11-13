"use client";

export default function Sidebar({
  activeSection,
  setActiveSection,
  onBackToList,
  userRole,
  onLogout,
}) {
  const menuItems = [
    { id: "view-products", label: "View Products", icon: "👁️" },
    { id: "add-product", label: "Add Product", icon: "➕" },
    { id: "categories", label: "Categories", icon: "📁" },
    { id: "blog", label: "Blog", icon: "📝" },
  ];

  // Add user management for admin only
  if (userRole === "admin") {
    menuItems.push({
      id: "user-management",
      label: "User Management",
      icon: "👥",
    });
  }

  return (
    <div className="w-64 bg-white shadow-lg fixed h-full">
      <button
        onClick={onLogout}
        className="w-full mb-4 px-4 py-2 bg-gray-100 text-blue-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center"
      >
        Log Out
      </button>

      <div className="pb-6 px-6 pt-2 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Role: {userRole}</p>
      </div>

      <nav className="p-4">
        {onBackToList && (
          <button
            onClick={onBackToList}
            className="w-full mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center"
          >
            ← Back to Products
          </button>
        )}

        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 flex items-center space-x-3 ${
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
