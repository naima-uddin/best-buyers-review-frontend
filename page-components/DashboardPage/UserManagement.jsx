"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  X,
  Mail,
  Shield,
} from "lucide-react";
import { useUserRole } from "../../app/(main)/dashboard/context/UserRoleContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";
import { Card, CardContent } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";

export default function UserManagement() {
  const { userRole } = useUserRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "moderator",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/users`;

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
        alert(
          editingUser
            ? "User updated successfully!"
            : "User created successfully!"
        );
        setShowForm(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "", role: "moderator" });
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
      password: "", // Don't fill password for security
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    setFormData({ name: "", email: "", password: "", role: "moderator" });
  };

  // Filter users by search
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-600" />
                  User Management
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage admin and moderator accounts
                </p>
              </div>

              <Button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={20} />
                Add User
              </Button>
            </div>
          </div>

          {/* User Form */}
          {showForm && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                        {!editingUser && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <input
                        type="password"
                        required={!editingUser}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder={
                          editingUser
                            ? "Leave blank to keep current password"
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                      >
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingUser ? "Update User" : "Create User"}
                    </Button>
                    <Button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          {!showForm && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Clear search"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Table */}
          <Card>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No users found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "Try a different search term."
                      : "Get started by creating a new user account."}
                  </p>
                  {!searchQuery && (
                    <div className="mt-6">
                      <Button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                      >
                        <Plus size={16} />
                        Add User
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
                        <TableHead className="w-16 font-bold text-gray-700">
                          #
                        </TableHead>
                        <TableHead className="min-w-[300px] font-bold text-gray-700">
                          User
                        </TableHead>
                        <TableHead className="font-bold text-gray-700">
                          Role
                        </TableHead>
                        <TableHead className="font-bold text-gray-700">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <TableRow
                          key={user._id}
                          className="hover:bg-green-50/50 transition-colors"
                        >
                          <TableCell className="font-semibold text-gray-600">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm">
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-4">
                              {/* User Avatar */}
                              <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-green-200 flex-shrink-0 shadow-sm border border-green-200 flex items-center justify-center">
                                <Users className="h-8 w-8 text-green-600" />
                              </div>

                              {/* User Info */}
                              <div className="min-w-0 flex-1 py-1">
                                <p
                                  className="font-semibold text-gray-900 line-clamp-1 leading-snug mb-1.5 hover:text-green-600 transition-colors cursor-default"
                                  title={user.name}
                                >
                                  {user.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    {user.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                              className="font-medium flex items-center gap-1.5 w-fit"
                            >
                              <Shield className="h-3 w-3" />
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.isActive ? "success" : "outline"}
                              className="font-medium"
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-blue-200"
                                title="Edit user"
                              >
                                <Edit size={18} />
                              </button>
                              {userRole === "admin" && (
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md hover:scale-105 border border-transparent hover:border-red-200"
                                  title="Delete user"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
