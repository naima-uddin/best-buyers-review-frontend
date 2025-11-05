"use client";
import api from "@/lib/api/axios";
import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

const CategoryForm = ({ onCreated, categories, editCategory }) => {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [image, setImage] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name || "");
      setParent(editCategory.parent || "");
      setImage(null);
      setSubCategories([]);
    }
  }, [editCategory]);

  // --- Subcategory handlers ---
  const addSubCategory = () =>
    setSubCategories([...subCategories, { name: "", image: null, subSub: [] }]);
  const removeSubCategory = (index) =>
    setSubCategories(subCategories.filter((_, i) => i !== index));

  // --- Sub-subcategory handlers ---
  const addSubSubCategory = (i) => {
    const updated = [...subCategories];
    updated[i].subSub.push({ name: "", image: null });
    setSubCategories(updated);
  };
  const removeSubSubCategory = (i, j) => {
    const updated = [...subCategories];
    updated[i].subSub.splice(j, 1);
    setSubCategories(updated);
  };

  // --- Input change handlers ---
  const handleSubCategoryChange = (i, field, value) => {
    const updated = [...subCategories];
    updated[i][field] = value;
    setSubCategories(updated);
  };
  const handleSubSubChange = (i, j, field, value) => {
    const updated = [...subCategories];
    updated[i].subSub[j][field] = value;
    setSubCategories(updated);
  };

  // --- Utility function to check duplicate sub-sub names ---
const hasDuplicateSubSub = (subCategories) => {
  for (const sub of subCategories) {
    const seen = new Set();
    for (const subSub of sub.subSub || []) {
      const name = subSub.name?.trim().toLowerCase();
      if (!name) continue; // skip empty names
      if (seen.has(name)) {
        // return both the duplicate flag and the name
        return { hasDuplicate: true, duplicateName: subSub.name.trim() };
      }
      seen.add(name);
    }
  }
  return { hasDuplicate: false };
};


  // --- Submit Handler ---
  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
const { hasDuplicate, duplicateName } = hasDuplicateSubSub(subCategories);
  if (hasDuplicate) {
    setMessage(`❌ Duplicate sub–sub category name "${duplicateName}" found. Please remove or rename it.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return; // stop submission
  }

 setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (parent) formData.append("parent", parent);
      if (image) formData.append("image", image);

      // Create / Update main category
      const res = editCategory
        ? await api.put(`/categories/${editCategory._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post("/categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      const mainCategory = res.data;

      // Create subcategories and sub-subcategories
      for (const sub of subCategories) {
        const subForm = new FormData();
        subForm.append("name", sub.name);
        subForm.append("parent", mainCategory._id);
        if (sub.image) subForm.append("image", sub.image);

        const subRes = await api.post("/categories", subForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        for (const subSub of sub.subSub) {
          const subSubForm = new FormData();
          subSubForm.append("name", subSub.name);
          subSubForm.append("parent", subRes.data._id);
          if (subSub.image) subSubForm.append("image", subSub.image);
          await api.post("/categories", subSubForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      setMessage("✅ Category and subcategories saved successfully!");
      onCreated();
    } catch (err) {
      console.error("Error submitting category:", err);
      setMessage("❌ Failed to save category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Flatten categories for dropdown ---
// --- Flatten categories for dropdown ---
const flattenCategories = (cats = [], depth = 0) =>
  cats.flatMap((c) => [
    { _id: c._id, name: "—".repeat(depth) + " " + c.name },
    ...flattenCategories(c.children || [], depth + 1),
  ]);

const allOptions = flattenCategories(categories || []);


  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {editCategory ? "Edit Category" : "Create New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Category Section */}
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium">
            Category Name
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block text-gray-700 font-medium">
            Parent Category (optional)
          </label>
          <select
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select parent category</option>
            {allOptions.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.name}
              </option>
            ))}
          </select>

          <label className="block text-gray-700 font-medium">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm text-gray-600"
          />
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-200 my-4" />

        {/* Subcategories Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Subcategories
            </h3>
            <button
              type="button"
              onClick={addSubCategory}
              className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={14} /> Add Subcategory
            </button>
          </div>

          {subCategories.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              No subcategories added yet.
            </p>
          )}

          {subCategories.map((sub, i) => (
            <div
              key={i}
              className="border border-gray-200 bg-gray-50 rounded-xl p-4 mt-3 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700">
                  Subcategory {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubCategory(i)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Subcategory name"
                value={sub.name}
                onChange={(e) =>
                  handleSubCategoryChange(i, "name", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleSubCategoryChange(i, "image", e.target.files[0])
                }
                className="text-sm text-gray-600"
              />

              {/* Sub–Subcategories */}
              <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Sub–Subcategories
                  </h4>
                  <button
                    type="button"
                    onClick={() => addSubSubCategory(i)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                {sub.subSub.map((ss, j) => (
                  <div
                    key={j}
                    className="bg-white border border-gray-200 rounded-lg p-3 mt-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        placeholder="Sub–Subcategory name"
                        value={ss.name}
                        onChange={(e) =>
                          handleSubSubChange(i, j, "name", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeSubSubCategory(i, j)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleSubSubChange(i, j, "image", e.target.files[0])
                      }
                      className="text-sm text-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
          {message && (
            <p className="text-sm text-gray-600 mt-3 font-medium">{message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
