"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { authFetch } from '@/lib/api/authFetch';

export default function BlogMediaLibrary({ onSelect = null, showSelection = true }) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const { user } = useUser();

  const [items, setItems]               = useState([]);
  const [folder, setFolder]             = useState('');
  const [q, setQ]                       = useState('');
  const [nextCursor, setNextCursor]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [selected, setSelected]         = useState(new Set());
  const [deleting, setDeleting]         = useState(false);
  const [hoverId, setHoverId]           = useState(null);
  const [previewItem, setPreviewItem]   = useState(null);

  const qTimer = useRef(null);

  const loadImages = useCallback(async (reset = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (folder) params.set('folder', folder);
      if (q)      params.set('q', q);
      if (!reset && nextCursor) params.set('next_cursor', nextCursor);

      const r = await authFetch(`${API}/admin/media?${params}`);
      const b = await r.json();
      const fresh = b.items || [];
      setItems(prev => reset ? fresh : [...prev, ...fresh]);
      setNextCursor(b.next_cursor || null);
      if (reset) setSelected(new Set());
    } catch (e) {
      console.error(e);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [API, folder, q, nextCursor]);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleQChange = (val) => {
    setQ(val);
    clearTimeout(qTimer.current);
    qTimer.current = setTimeout(() => loadImages(true), 300);
  };

  const toggleSelected = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} item(s)?`)) return;

    setDeleting(true);
    try {
      const body = JSON.stringify({ public_ids: [...selected] });
      const resp = await authFetch(`${API}/admin/media`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      if (!resp.ok) throw new Error('Delete failed');
      toast.success(`Deleted ${selected.size} item(s)`);
      loadImages(true);
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item);
    } else {
      toggleSelected(item.public_id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All folders</option>
          </select>
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search images..."
            value={q}
            onChange={(e) => handleQChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        {showSelection && selected.size > 0 && (
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
          >
            {deleting ? 'Deleting...' : `Delete (${selected.size})`}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {items.map(item => (
          <div
            key={item.public_id}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all ${
              selected.has(item.public_id) ? 'border-indigo-500' : 'border-transparent'
            } ${onSelect ? 'hover:border-green-400' : 'hover:border-indigo-400'}`}
            onMouseEnter={() => setHoverId(item.public_id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => handleSelect(item)}
          >
            {/* Media Preview */}
            {item.resource_type === 'video' ? (
              <video
                src={item.url || item.secure_url}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
            ) : (
              <img
                src={item.url || item.secure_url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0  group-hover:bg-opacity-30 transition-all duration-200" />
            
            {/* Selection Indicator */}
            {(showSelection && selected.has(item.public_id)) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                ✓
              </div>
            )}

            {/* Select Button */}
            {onSelect && hoverId === item.public_id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                  Select
                </button>
              </div>
            )}

            {/* Type Badge */}
            {item.resource_type === 'video' && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                VIDEO
              </div>
            )}

            {/* File Info Tooltip */}
            {hoverId === item.public_id && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2">
                <div className="truncate">{item.public_id.split('/').pop()}</div>
                <div>{Math.round(item.bytes / 1024)}KB • {item.width}×{item.height}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {nextCursor && (
        <div className="text-center">
          <button
            onClick={() => loadImages(false)}
            disabled={loading}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📁</div>
          <p>No media found in blog folder</p>
          <p className="text-sm">Upload some images or videos to get started</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
            >
              ✕
            </button>
            {previewItem.resource_type === 'video' ? (
              <video src={previewItem.secure_url} controls className="max-w-full max-h-full" />
            ) : (
              <img src={previewItem.secure_url} alt="" className="max-w-full max-h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}