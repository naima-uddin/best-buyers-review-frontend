"use client";
import { useState, useEffect } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'moderator'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingUser 
        ? `http://localhost:5000/api/users/${editingUser._id}`
        : "http://localhost:5000/api/users";
      
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(editingUser ? "User updated successfully!" : "User created successfully!");
        setShowForm(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'moderator' });
        fetchUsers();
      } else {
        alert(result.message || "Failed to save user");
      }
    } catch (error) {
      console.error("Save user error:", error);
      alert("Error saving user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't fill password for security
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          alert("User deleted successfully!");
          fetchUsers();
        } else {
          alert(result.message || "Failed to delete user");
        }
      } catch (error) {
        console.error("Delete user error:", error);
        alert("Error deleting user");
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'moderator' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage admin and moderator accounts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add User
        </button>
      </div>

      {/* User Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                  {!editingUser && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={editingUser ? "Leave blank to keep current password" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No users yet
            </h3>
            <p className="text-gray-600">
              Click "Add User" to create the first user account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    USER
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    ROLE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}