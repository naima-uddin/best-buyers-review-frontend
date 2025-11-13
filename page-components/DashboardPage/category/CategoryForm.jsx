"use client";
import api from "@/lib/api/axios";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, ChevronDown } from "lucide-react";

const CategoryForm = ({ onCreated, categories, editCategory }) => {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [showParentDropdown, setShowParentDropdown] = useState(false);
  const [image, setImage] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name || "");
      setParent(editCategory.parent || "");

      // Set parent search text if parent exists
      if (editCategory.parent) {
        const flatCats = flattenCategories(categories || []);
        const parentCat = flatCats.find(c => c._id === editCategory.parent);
        if (parentCat) {
          setParentSearch(parentCat.name.replace(/^—*\s*/, ""));
        }
      } else {
        setParentSearch("");
      }

      setImage(null);
      setSubCategories([]);
      setErrors({});
    }
  }, [editCategory, categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".parent-category-dropdown")) {
        setShowParentDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Flatten categories for dropdown ---
  const flattenCategories = (cats = [], depth = 0) =>
    cats.flatMap((c) => [
      { _id: c._id, name: "—".repeat(depth) + " " + c.name },
      ...flattenCategories(c.children || [], depth + 1),
    ]);

  // --- Parent category handlers ---
  const selectParentCategory = (category) => {
    setParent(category._id);
    setParentSearch(category.name.replace(/^—*\s*/, ""));
    setShowParentDropdown(false);
  };

  const clearParentCategory = () => {
    setParent("");
    setParentSearch("");
  };

  // Filter parent categories based on search
  const allOptions = flattenCategories(categories || []);
  const filteredParentOptions = allOptions.filter((cat) =>
    cat.name.toLowerCase().includes(parentSearch.toLowerCase())
  );

  // --- Improved Validation function ---
  const validateDuplicates = () => {
    const newErrors = {};
    let hasDuplicates = false;

    // Check for duplicate subcategories
    const subNames = subCategories.map(sub => sub.name.trim());
    const duplicateSubs = subNames.filter((name, index) => 
      name && subNames.indexOf(name) !== index
    );
    
    if (duplicateSubs.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateSubs)];
      newErrors.subCategories = `Duplicate subcategory names found: ${uniqueDuplicates.join(', ')}`;
      hasDuplicates = true;
    }

    // Check for duplicate sub-subcategories within each subcategory
    subCategories.forEach((sub, i) => {
      if (sub.subSub && sub.subSub.length > 0) {
        const subSubNames = sub.subSub.map(ss => ss.name.trim());
        const duplicateSubSubs = subSubNames.filter((name, index) => 
          name && subSubNames.indexOf(name) !== index
        );
        
        if (duplicateSubSubs.length > 0) {
          const uniqueDuplicates = [...new Set(duplicateSubSubs)];
          const subNameDisplay = sub.name || `Subcategory ${i+1}`;
          newErrors[`subSub_${i}`] = `Duplicate sub-subcategory names in "${subNameDisplay}": ${uniqueDuplicates.join(', ')}`;
          hasDuplicates = true;
        }
      }
    });

    setErrors(newErrors);
    return !hasDuplicates;
  };

  // --- Subcategory handlers ---
  const addSubCategory = () => {
    setSubCategories([...subCategories, { name: "", image: null, subSub: [] }]);
    setErrors({});
  };

  const removeSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
    setErrors({});
  };

  // --- Sub-subcategory handlers ---
  const addSubSubCategory = (i) => {
    const updated = [...subCategories];
    updated[i].subSub.push({ name: "", image: null });
    setSubCategories(updated);
    setErrors({});
  };

  const removeSubSubCategory = (i, j) => {
    const updated = [...subCategories];
    updated[i].subSub.splice(j, 1);
    setSubCategories(updated);
    setErrors({});
  };

  // --- Input change handlers ---
  const handleSubCategoryChange = (i, field, value) => {
    const updated = [...subCategories];
    updated[i][field] = value;
    setSubCategories(updated);
    
    // Clear errors when user types
    if (field === 'name') {
      setErrors({});
    }
  };

  const handleSubSubChange = (i, j, field, value) => {
    const updated = [...subCategories];
    updated[i].subSub[j][field] = value;
    setSubCategories(updated);
    
    // Clear errors when user types
    if (field === 'name') {
      setErrors({});
    }
  };

  // --- Real-time validation on blur ---
  const handleSubCategoryBlur = () => {
    validateDuplicates();
  };

  const handleSubSubBlur = () => {
    validateDuplicates();
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    // Validate duplicates before submitting
    const isValid = validateDuplicates();
    if (!isValid) {
      // Get all duplicate names for the main error message
      const allDuplicateNames = [];
      
      // Collect duplicate subcategory names
      if (errors.subCategories) {
        const subMatches = errors.subCategories.match(/Duplicate subcategory names found: (.*)/);
        if (subMatches) {
          allDuplicateNames.push(...subMatches[1].split(', '));
        }
      }
      
      // Collect duplicate sub-subcategory names
      Object.keys(errors).forEach(key => {
        if (key.startsWith('subSub_')) {
          const subSubMatches = errors[key].match(/Duplicate sub-subcategory names in "[^"]*": (.*)/);
          if (subSubMatches) {
            allDuplicateNames.push(...subSubMatches[1].split(', '));
          }
        }
      });

      const uniqueDuplicates = [...new Set(allDuplicateNames)];
      setMessage(`❌ Please fix duplicate category names before submitting: ${uniqueDuplicates.join(', ')}`);
      setLoading(false);
      return;
    }

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

          <label className="block text-gray-700 font-medium mb-2">
            Parent Category (optional)
          </label>
          <div className="relative parent-category-dropdown">
            <input
              type="text"
              placeholder="Search parent category..."
              value={parentSearch}
              onChange={(e) => setParentSearch(e.target.value)}
              onFocus={() => setShowParentDropdown(true)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {parent && (
                <button
                  type="button"
                  onClick={clearParentCategory}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Clear selection"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              )}
              <ChevronDown size={20} className="text-gray-400" />
            </div>

            {/* Dropdown */}
            {showParentDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredParentOptions.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        clearParentCategory();
                        setShowParentDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 text-gray-500 italic"
                    >
                      None (Top Level)
                    </button>
                    {filteredParentOptions.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => selectParentCategory(category)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No categories found
                  </div>
                )}
              </div>
            )}
          </div>

          <label className="block text-gray-700 font-medium mt-4">
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

          {/* Duplicate Error Message */}
          {errors.subCategories && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{errors.subCategories}</p>
            </div>
          )}

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
                onBlur={handleSubCategoryBlur}
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

                {/* Sub-subcategory duplicate error */}
                {errors[`subSub_${i}`] && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs font-medium">{errors[`subSub_${i}`]}</p>
                  </div>
                )}

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
                        onBlur={handleSubSubBlur}
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
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
          {message && (
            <p className={`text-sm mt-3 font-medium ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}>
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;