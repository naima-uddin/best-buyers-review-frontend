"use client";
import React from "react";

export default function BlogTable({ blogs, onEdit, onDelete }) {
  return (
    <div className="bg-white border rounded p-4">
      <h2 className="text-xl font-semibold mb-3">All Blogs</h2>

      {!blogs?.length ? (
        <p className="text-gray-500">No blog posts available</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Published</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="p-2 border">{blog.title}</td>
                <td className="p-2 border">{blog.author?.name}</td>
                <td className="p-2 border">
                  {blog.published ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-red-600 font-medium">No</span>
                  )}
                </td>
                <td className="p-2 border space-x-2">
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
