"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '@/lib/api/authFetch';

export default function MediaPicker({ 
  onSelect, 
  value = null,
  folder = 'yourhaat/blog',
  accept = 'image/*',
  label = 'Select Image',
  className = ''
}) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState('');

  const loadImages = useCallback(async (reset = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (folder) params.set('folder', folder);
      if (q) params.set('q', q);
      if (!reset && nextCursor) params.set('next_cursor', nextCursor);

      const r = await authFetch(`${API}/admin/media?${params}`);
      const b = await r.json();
      const fresh = b.items || [];
      setItems(prev => reset ? fresh : [...prev, ...fresh]);
      setNextCursor(b.next_cursor || null);
    } catch (e) {
      console.error('Failed to load media:', e);
    } finally {
      setLoading(false);
    }
  }, [API, folder, q, nextCursor]);

  useEffect(() => {
    if (isOpen) {
      loadImages(true);
    }
  }, [isOpen]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);

      const r = await authFetch(`${API}/blog/admin/upload`, {
        method: 'POST',
        body: fd
      });

      const b = await r.json();
      if (!r.ok) throw new Error(b.error || 'Upload failed');

      // Auto-select the uploaded image
      const asset = {
        url: b.asset.url,
        publicId: b.asset.publicId,
        width: b.asset.width,
        height: b.asset.height,
        format: b.asset.format
      };
      onSelect(asset);
      setIsOpen(false);
      
      // Refresh the list
      loadImages(true);
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSelect = (item) => {
    const asset = {
      url: item.secure_url,
      publicId: item.public_id,
      width: item.width,
      height: item.height,
      format: item.format
    };
    onSelect(asset);
    setIsOpen(false);
  };

  const handleRemove = () => {
    onSelect(null);
  };

  return (
    <div className={className}>
      {/* Current Selection Preview */}
      {value ? (
        <div className="relative inline-block">
          <img 
            src={value.url || value} 
            alt="" 
            className="w-32 h-32 object-cover rounded border"
          />
          <div className="absolute -top-2 -right-2 flex gap-1">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-blue-700"
              title="Change"
            >
              ✎
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
              title="Remove"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition"
        >
          {label}
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Select Media</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b flex gap-3 flex-wrap">
              <label className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition">
                {uploading ? 'Uploading...' : 'Upload New'}
                <input
                  type="file"
                  accept={accept}
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setTimeout(() => loadImages(true), 300);
                }}
                className="flex-1 min-w-[200px] px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => loadImages(true)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading && items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📁</div>
                  <p>No media found</p>
                  <p className="text-sm">Upload some images to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {items.map(item => (
                    <div
                      key={item.public_id}
                      onClick={() => handleSelect(item)}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-500 transition group relative"
                    >
                      {item.resource_type === 'video' ? (
                        <video
                          src={item.secure_url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={item.secure_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 font-medium text-sm">
                          Select
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {nextCursor && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => loadImages(false)}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
