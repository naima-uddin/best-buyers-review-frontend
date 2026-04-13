import React from 'react';
import BlogMediaLibrary from '@/components/dashboard/Blog/BlogMediaLibrary';

export default function BlogMediaPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded shadow mb-6">
        <h1 className="text-xl font-semibold">Blog Media Library</h1>
        <p className="text-sm text-gray-600 mt-2">
          View all uploaded blog images from Cloudinary and delete selected images.
        </p>
      </div>

      <BlogMediaLibrary showSelection={true} />
    </div>
  );
}
