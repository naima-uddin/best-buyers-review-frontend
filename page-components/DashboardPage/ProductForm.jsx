"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api/axios";

export default function ProductForm({ onSubmit, onCancel, categories, categoriesLoading }) {
  const [asins, setAsins] = useState([""]);
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedSubSub, setSelectedSubSub] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [seo, setSeo] = useState({
    title: "",
    description: "",
    keywords: "",
  });

  // ✅ REMOVED the useEffect that fetches categories - using passed categories instead

  // ✅ Helpers for category dropdowns - USING PASSED CATEGORIES
  const mainCategories = categories || [];
  const subCategories = selectedMain 
    ? categories.find(cat => cat._id === selectedMain)?.children || []
    : [];
  const subSubCategories = selectedSub
    ? subCategories.find(sub => sub._id === selectedSub)?.children || []
    : [];

  // ✅ Add/remove ASINs
  const addAsinField = () => {
    if (asins.length < 10) setAsins([...asins, ""]);
  };

  const removeAsinField = (index) => {
    if (asins.length > 1) setAsins(asins.filter((_, i) => i !== index));
  };

  const updateAsin = (index, value) => {
    const newAsins = [...asins];
    newAsins[index] = value.toUpperCase();
    setAsins(newAsins);
  };

  // ✅ Handle SEO changes
  const handleSeoChange = (field, value) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Submit products with ASINs, category & SEO
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    const validAsins = asins.filter((a) => a.trim() !== "");
    if (validAsins.length === 0) {
      setError("Please enter at least one ASIN");
      setLoading(false);
      return;
    }

    const invalidAsins = validAsins.filter((a) => !/^[A-Z0-9]{10}$/.test(a));
    if (invalidAsins.length) {
      setError(`Invalid ASINs: ${invalidAsins.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const requestData = { asins: validAsins };

      // If no category is selected, automatically assign to "Uncategorized"
      if (!selectedMain && !selectedSub && !selectedSubSub) {
        const uncategorized = categories.find(cat => 
          cat.name.toLowerCase() === 'uncategorized'
        );
        if (uncategorized) {
          requestData.mainCategory = uncategorized._id;
        }
      } else {
        if (selectedMain) requestData.mainCategory = selectedMain;
        if (selectedSub) requestData.subCategory = selectedSub;
        if (selectedSubSub) requestData.subSubCategory = selectedSubSub;
      }

      if (seo.title || seo.description || seo.keywords) {
        requestData.seo = {
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();

      if (response.ok) {
  
  // 👉 Sort according to the ASIN input order
        if (result.data?.products?.length) {
          const sorted = result.data.products.sort((a, b) => 
            validAsins.indexOf(a.asin) - validAsins.indexOf(b.asin)
          );
          result.data.products = sorted;
        }

        alert(
          `✅ Successfully added ${result.data?.added?.length || 0} products!`
        );

        setAsins([""]);
        setSelectedMain("");
        setSelectedSub("");
        setSelectedSubSub("");
        setSeo({ title: "", description: "", keywords: "" });

        if (onSubmit) onSubmit(result.data.products);
      }else {
        setError(result.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Add Products by ASIN
          </h1>
          <p className="text-gray-600 mt-1">
            Enter Amazon ASINs to fetch product data automatically.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Show categories loading state if needed */}
          {categoriesLoading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">Loading categories...</p>
            </div>
          )}

          {/* ASIN Inputs */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Amazon ASINs {asins.length > 1 && `(${asins.length}/10)`}
            </label>
            <div className="space-y-3">
              {asins.map((asin, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    value={asin}
                    onChange={(e) => updateAsin(i, e.target.value)}
                    maxLength={10}
                    placeholder="Enter ASIN (10 chars)"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {asins.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAsinField(i)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {asins.length < 10 && (
              <button
                type="button"
                onClick={addAsinField}
                className="mt-3 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                + Add ASIN
              </button>
            )}
          </div>

          {/* Category Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-800">
              Product Category (for all products)
            </label>
            
            {/* Info message about Uncategorized */}
            {!selectedMain && !selectedSub && !selectedSubSub && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  ℹ️ No category selected. Products will be added to <strong>Uncategorized</strong> category by default.
                </p>
              </div>
            )}

            {/* Main */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Category
              </label>
              <select
                value={selectedMain}
                onChange={(e) => {
                  setSelectedMain(e.target.value);
                  setSelectedSub("");
                  setSelectedSubSub("");
                }}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Main Category</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub */}
            {subCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category
                </label>
                <select
                  value={selectedSub}
                  onChange={(e) => {
                    setSelectedSub(e.target.value);
                    setSelectedSubSub("");
                  }}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sub-Sub */}
            {subSubCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Sub Category
                </label>
                <select
                  value={selectedSubSub}
                  onChange={(e) => setSelectedSubSub(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Sub-Sub Category</option>
                  {subSubCategories.map((ssub) => (
                    <option key={ssub._id} value={ssub._id}>
                      {ssub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* SEO Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">
              SEO Information
            </h3>

            <input
              type="text"
              value={seo.title}
              onChange={(e) => handleSeoChange("title", e.target.value)}
              placeholder="SEO Title"
              className="w-full border rounded-lg px-3 py-2"
            />

            <textarea
              rows={3}
              value={seo.description}
              onChange={(e) => handleSeoChange("description", e.target.value)}
              placeholder="SEO Description"
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => handleSeoChange("keywords", e.target.value)}
              placeholder="Comma-separated SEO Keywords"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Fetching..." : "Fetch Products"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}