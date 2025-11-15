"use client";
import React from "react";

export default function BlogTable({ blogs, onEdit, onDelete }) {
  return (
    <div className="bg-white border rounded p-4">
      <h2 className="text-xl font-semibold mb-3">All Blog Posts</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blog posts found.</p>
      ) : (
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
                  <button
                    onClick={() => onEdit(blog.slug)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <a
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </a>

                  <button
                    onClick={() => onDelete(blog.slug)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
