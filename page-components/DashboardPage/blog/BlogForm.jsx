"use client";
import React, { useState, useEffect } from "react";

export default function BlogForm({ categories, categoriesLoading, onSubmit, editingData }) {
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedSubSub, setSelectedSubSub] = useState("");

  // Category dropdown states
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [showSubSubDropdown, setShowSubSubDropdown] = useState(false);
  const [mainCategorySearch, setMainCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [subSubCategorySearch, setSubSubCategorySearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    excerpt: "",
    featuredImageUrl: "",
    featuredImagePublicId: "",
    categories: "",
    tags: "",
    authorName: "",
    authorAvatar: "",
    authorBio: "",
    sponsorName: "",
    sponsorLink: "",
    sponsorLogo: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoCanonicalUrl: "",
    isFeatured: false,
    published: false,
  });

  const [contentBlocks, setContentBlocks] = useState([
    { type: "paragraph", data: { text: [{ value: "" }], items: [] } },
  ]);

  const [contentImages, setContentImages] = useState([{ url: "", file: null }]);

  // ✅ Use the same logic as your ProductsPage for category filtering
  const getMainCategories = () => {
    return categories?.filter((cat) => cat.level === 1) || [];
  };

  const getSubCategories = (mainCategoryId) => {
    if (!mainCategoryId) return [];
    const mainCategory = categories.find((cat) => cat._id === mainCategoryId);
    return mainCategory?.children || [];
  };

  const getSubSubCategories = (subCategoryId) => {
    if (!subCategoryId) return [];
    const subCategory = getSubCategories(selectedMain).find((cat) => cat._id === subCategoryId);
    return subCategory?.children || [];
  };

  const mainCategories = getMainCategories();
  const subCategories = getSubCategories(selectedMain);
  const subSubCategories = getSubSubCategories(selectedSub);

  // Filter categories based on search
  const filteredMainCategories = mainCategories.filter((cat) =>
    cat.name.toLowerCase().includes(mainCategorySearch.toLowerCase())
  );

  const filteredSubCategories = subCategories.filter((cat) =>
    cat.name.toLowerCase().includes(subCategorySearch.toLowerCase())
  );

  const filteredSubSubCategories = subSubCategories.filter((cat) =>
    cat.name.toLowerCase().includes(subSubCategorySearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".category-dropdown")) {
        setShowMainDropdown(false);
        setShowSubDropdown(false);
        setShowSubSubDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingData) {
      setFormData({
        title: editingData.title,
        description: editingData.description,
        excerpt: editingData.excerpt,
        featuredImageUrl: editingData.featuredImage?.url || "",
        featuredImagePublicId: editingData.featuredImage?.public_id || "",
        categories: editingData.categories.join(", "),
        tags: editingData.tags.join(", "),
        authorName: editingData.author?.name || "",
        authorAvatar: editingData.author?.avatar || "",
        authorBio: editingData.author?.bio || "",
        sponsorName: editingData.sponsor?.name || "",
        sponsorLink: editingData.sponsor?.link || "",
        sponsorLogo: editingData.sponsor?.logo || "",
        seoTitle: editingData.seo?.title || "",
        seoDescription: editingData.seo?.description || "",
        seoKeywords: editingData.seo?.keywords.join(", "),
        seoCanonicalUrl: editingData.seo?.canonicalUrl || "",
        isFeatured: editingData.isFeatured || false,
        published: editingData.published || false,
      });

      setContentBlocks(editingData.content || []);
      setContentImages(editingData.contentImages?.map(img => ({ url: img.url, file: null })) || [{ url: "", file: null }]);
    }
  }, [editingData]);

  // Handle category selections
  const selectMainCategory = (category) => {
    setSelectedMain(category._id);
    setMainCategorySearch(category.name);
    setShowMainDropdown(false);
    setSelectedSub("");
    setSubCategorySearch("");
    setSelectedSubSub("");
    setSubSubCategorySearch("");
  };

  const selectSubCategory = (category) => {
    setSelectedSub(category._id);
    setSubCategorySearch(category.name);
    setShowSubDropdown(false);
    setSelectedSubSub("");
    setSubSubCategorySearch("");
  };

  const selectSubSubCategory = (category) => {
    setSelectedSubSub(category._id);
    setSubSubCategorySearch(category.name);
    setShowSubSubDropdown(false);
  };

  // Clear category selections
  const clearMainCategory = () => {
    setSelectedMain("");
    setMainCategorySearch("");
    setSelectedSub("");
    setSubCategorySearch("");
    setSelectedSubSub("");
    setSubSubCategorySearch("");
  };

  const clearSubCategory = () => {
    setSelectedSub("");
    setSubCategorySearch("");
    setSelectedSubSub("");
    setSubSubCategorySearch("");
  };

  const clearSubSubCategory = () => {
    setSelectedSubSub("");
    setSubSubCategorySearch("");
  };

  // Handle form input changes - SIMPLIFIED
  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleCheckbox = (name) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleContentBlockChange = (index, value) => {
    const updated = [...contentBlocks];
    updated[index].data.text[0].value = value;
    setContentBlocks(updated);
  };

  const addContentBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      { type: "paragraph", data: { text: [{ value: "" }], items: [] } },
    ]);
  };

  const removeContentBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const handleContentImageChange = (index, value) => {
    const updated = [...contentImages];
    updated[index].url = value;
    setContentImages(updated);
  };

  const handleFileUpload = (index, file) => {
    const updated = [...contentImages];
    updated[index].file = file;
    
    const previewUrl = URL.createObjectURL(file);
    updated[index].url = previewUrl;
    
    setContentImages(updated);
  };

  const addContentImage = () => {
    setContentImages([...contentImages, { url: "", file: null }]);
  };

  const removeContentImage = (index) => {
    setContentImages(contentImages.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Prepare category data for submission
    const selectedCategories = [];
    if (selectedMain) selectedCategories.push(selectedMain);
    if (selectedSub) selectedCategories.push(selectedSub);
    if (selectedSubSub) selectedCategories.push(selectedSubSub);

    const payload = {
      title: formData.title,
      description: formData.description,
      excerpt: formData.excerpt,
      featuredImage: {
        url: formData.featuredImageUrl,
        public_id: formData.featuredImagePublicId,
      },
      content: contentBlocks,
      categories: [...selectedCategories, ...formData.categories.split(",").map((c) => c.trim()).filter(c => c)],
      tags: formData.tags.split(",").map((t) => t.trim()).filter(t => t),
      author: {
        name: formData.authorName,
        avatar: formData.authorAvatar,
        bio: formData.authorBio,
      },
      sponsor: {
        name: formData.sponsorName,
        link: formData.sponsorLink,
        logo: formData.sponsorLogo,
      },
      seo: {
        title: formData.seoTitle,
        description: formData.seoDescription,
        keywords: formData.seoKeywords.split(",").map((k) => k.trim()).filter(k => k),
        canonicalUrl: formData.seoCanonicalUrl,
      },
      contentImages: contentImages.map((img) => ({
        url: img.url,
        public_id: "",
        file: img.file,
      })),
      isFeatured: formData.isFeatured,
      published: formData.published,
    };

    onSubmit(payload);
  };

  const Section = ({ title, children, className = "" }) => (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <form onSubmit={submitHandler} className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Basic Information */}
      <Section title="Basic Information">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Blog Title *</label>
            <input
              type="text"
              placeholder="Enter a compelling title for your blog post"
              name="title"
              value={formData.title}
              onChange={handleBasicChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              placeholder="Write a detailed description of your blog post"
              name="description"
              value={formData.description}
              onChange={handleBasicChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Excerpt</label>
            <textarea
              placeholder="Brief summary of your post (max 200 characters)"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleBasicChange}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>
        </div>
      </Section>

      {/* Featured Image */}
      <Section title="Featured Image">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/featured-image.jpg"
            name="featuredImageUrl"
            value={formData.featuredImageUrl}
            onChange={handleBasicChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        {formData.featuredImageUrl && (
          <div className="mt-2">
            <img 
              src={formData.featuredImageUrl} 
              alt="Featured preview" 
              className="h-32 w-auto rounded border"
            />
          </div>
        )}
      </Section>

      {/* Author Information */}
      <Section title="Author Information">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Author Name *</label>
            <input
              type="text"
              placeholder="John Doe"
              name="authorName"
              value={formData.authorName}
              onChange={handleBasicChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Author Avatar URL</label>
            <input
              type="text"
              placeholder="https://example.com/avatar.jpg"
              name="authorAvatar"
              value={formData.authorAvatar}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Author Bio</label>
            <textarea
              placeholder="Tell readers about the author"
              name="authorBio"
              value={formData.authorBio}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>
        </div>
      </Section>

      {/* Categories & Tags */}
      <Section title="Categories & Tags">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-800">
            Product Categories
          </label>

          {/* Loading State */}
          {categoriesLoading && (
            <div className="text-sm text-gray-500">Loading categories...</div>
          )}

          {/* Main Category Dropdown */}
          <div className="relative category-dropdown">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Category
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search main category..."
                value={mainCategorySearch}
                onChange={(e) => setMainCategorySearch(e.target.value)}
                onFocus={() => setShowMainDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {selectedMain && (
                  <button
                    type="button"
                    onClick={clearMainCategory}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Clear selection"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Dropdown */}
              {showMainDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredMainCategories.length > 0 ? (
                    filteredMainCategories.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => selectMainCategory(category)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No categories found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sub Category Dropdown */}
          {selectedMain && (
            <div className="relative category-dropdown">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sub category..."
                  value={subCategorySearch}
                  onChange={(e) => setSubCategorySearch(e.target.value)}
                  onFocus={() => setShowSubDropdown(true)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {selectedSub && (
                    <button
                      type="button"
                      onClick={clearSubCategory}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Clear selection"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showSubDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSubCategories.length > 0 ? (
                      filteredSubCategories.map((category) => (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => selectSubCategory(category)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No sub categories found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-Sub Category Dropdown */}
          {selectedSub && (
            <div className="relative category-dropdown">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Sub Category
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sub-sub category..."
                  value={subSubCategorySearch}
                  onChange={(e) => setSubSubCategorySearch(e.target.value)}
                  onFocus={() => setShowSubSubDropdown(true)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {selectedSubSub && (
                    <button
                      type="button"
                      onClick={clearSubSubCategory}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Clear selection"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showSubSubDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSubSubCategories.length > 0 ? (
                      filteredSubSubCategories.map((category) => (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => selectSubSubCategory(category)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No sub-sub categories found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Categories Display */}
          {(selectedMain || selectedSub || selectedSubSub) && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">Selected Categories:</p>
              <div className="text-sm text-blue-700">
                {selectedMain && (
                  <span>Main: {mainCategories.find(c => c._id === selectedMain)?.name}</span>
                )}
                {selectedSub && (
                  <span> → Sub: {subCategories.find(s => s._id === selectedSub)?.name}</span>
                )}
                {selectedSubSub && (
                  <span> → Sub-Sub: {subSubCategories.find(ss => ss._id === selectedSubSub)?.name}</span>
                )}
              </div>
            </div>
          )}

          {/* Manual Categories Input */}
          <div className="mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Additional Categories (comma-separated)</label>
              <input
                type="text"
                placeholder="technology, reviews, guide"
                name="categories"
                value={formData.categories}
                onChange={handleBasicChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Tags Input */}
          <div className="mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                placeholder="javascript, programming, tutorial"
                name="tags"
                value={formData.tags}
                onChange={handleBasicChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Content Blocks */}
      <Section title="Content Blocks">
        <div className="space-y-4">
          {contentBlocks.map((block, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Paragraph {index + 1}</label>
                <textarea
                  placeholder="Write your content here..."
                  value={block.data.text[0].value}
                  onChange={(e) => handleContentBlockChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[100px]"
                />
              </div>
              {contentBlocks.length > 1 && (
                <button
                  type="button"
                  className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  onClick={() => removeContentBlock(index)}
                >
                  Remove Block
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
            onClick={addContentBlock}
          >
            + Add Content Block
          </button>
        </div>
      </Section>

      {/* Content Images */}
      <Section title="Content Images">
        <div className="space-y-4">
          {contentImages.map((image, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL {index + 1}</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={image.url}
                    onChange={(e) => handleContentImageChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(index, e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {image.url && (
                  <div className="mt-2">
                    <img 
                      src={image.url} 
                      alt={`Content preview ${index + 1}`} 
                      className="h-24 w-auto rounded border"
                    />
                  </div>
                )}
                
                {contentImages.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    onClick={() => removeContentImage(index)}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
            onClick={addContentImage}
          >
            + Add Image
          </button>
        </div>
      </Section>

      {/* SEO Settings */}
      <Section title="SEO Settings">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SEO Title</label>
            <input
              type="text"
              placeholder="Optimized title for search engines"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SEO Description</label>
            <textarea
              placeholder="Meta description for search results"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Keywords</label>
            <input
              type="text"
              placeholder="keyword1, keyword2, keyword3"
              name="seoKeywords"
              value={formData.seoKeywords}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Canonical URL</label>
            <input
              type="text"
              placeholder="https://example.com/canonical-url"
              name="seoCanonicalUrl"
              value={formData.seoCanonicalUrl}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </Section>

      {/* Sponsor Information */}
      <Section title="Sponsor Information">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sponsor Name</label>
            <input
              type="text"
              placeholder="Company Name"
              name="sponsorName"
              value={formData.sponsorName}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sponsor Link</label>
            <input
              type="text"
              placeholder="https://company.com"
              name="sponsorLink"
              value={formData.sponsorLink}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sponsor Logo URL</label>
            <input
              type="text"
              placeholder="https://example.com/logo.png"
              name="sponsorLogo"
              value={formData.sponsorLogo}
              onChange={handleBasicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </Section>

      {/* Publication Settings */}
      <Section title="Publication Settings">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={() => toggleCheckbox("isFeatured")}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Feature this post</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={() => toggleCheckbox("published")}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
        </div>
      </Section>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
      >
        {editingData ? "Update Blog Post" : "Create Blog Post"}
      </button>
    </form>
  );
}