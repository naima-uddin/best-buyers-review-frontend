"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const res = await fetch("http://localhost:5000/api/blog");
    const data = await res.json();
    if (data.success) setBlogs(data.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this blog?")) return;

    const res = await fetch(`http://localhost:5000/api/blog/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) {
      alert("Blog Deleted");
      fetchBlogs();
    } else {
      alert("Delete Failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Blogs</h2>

      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td className="border p-2">{blog.title}</td>
              <td className="border p-2">{blog.authorName}</td>
              <td className="border p-2 space-x-2">
                <Link href={`/admin/blog/edit/${blog._id}`}>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                </Link>

                <Link href={`/blog/${blog._id}`}>
                  <button className="bg-green-600 text-white px-3 py-1 rounded">
                    View
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
