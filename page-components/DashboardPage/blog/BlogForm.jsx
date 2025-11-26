"use client";
import { LinkIcon, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CreateBlog({onSubmit, onCancel}) {
  const categoriesList = [
    "Food", "Tools", "Sports", "Pets", "Outdoor", "Office", "Money", "Health",
    "Gifts", "Home", "Garden", "Tech", "Fitness", "Fashion", "Beauty", "Baby"
  ];

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    categories: [],
    tags: [],
    seo: { title: "", description: "", keywords: "", canonicalUrl: "" },
    isFeatured: false,
    published: false,
    anchorTags: [] 
  });

  const [newAnchorTag, setNewAnchorTag] = useState({
    word: "",
    link: "",
    isExternal: false,
  });

  const addAnchorTag = () => {
    if (!newAnchorTag.word || !newAnchorTag.link) return;

    setForm(prev => ({
      ...prev,
      anchorTags: [...prev.anchorTags, newAnchorTag]
    }));

    setNewAnchorTag({ word: "", link: "", isExternal: false });
  };

  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState(null);

  const [tagInput, setTagInput] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);

  // ----------- Input Handlers --------------
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSEOInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      seo: { ...prev.seo, [name]: value }
    }));
  };

  const handleCategorySelect = (e) => {
    const selectedOptions = [...e.target.selectedOptions].map(o => o.value);
    setForm(prev => ({ ...prev, categories: selectedOptions }));
  };

  // ----------- Featured Image (Upload OR URL) --------------
  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
    setFeaturedPreview(URL.createObjectURL(file));
    setFeaturedImageUrl("");
  };

  const handleFeaturedImageUrl = (e) => {
    setFeaturedImageUrl(e.target.value);
    setFeaturedImage(null);
    setFeaturedPreview(e.target.value);
  };

  // ----------- Tags --------------
  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ----------- Content Blocks --------------
  const addContentBlock = (type) => {
    const newBlock = {
      type,
      data: { text: [{ value: "" }], url: "", items: [], alt: "", file: null }
    };
    setContentBlocks(prev => [...prev, newBlock]);
  };

  const updateBlockData = (index, field, value) => {
    const updated = [...contentBlocks];
    updated[index].data[field] = value;
    setContentBlocks(updated);
  };

  const updateBlockText = (index, value) => {
    const updated = [...contentBlocks];
    if (!updated[index].data.text) {
      updated[index].data.text = [{ type: "text", value: "" }];
    }
    updated[index].data.text[0].value = value;
    setContentBlocks(updated);
  };

  const handleBlockImageUpload = (index, file) => {
    const updated = [...contentBlocks];
    updated[index].data.file = file;
    updated[index].data.url = URL.createObjectURL(file);
    setContentBlocks(updated);
  };

  // ----------- Submit --------------
const handleSubmit = async (e) => {
  e.preventDefault();

  const processImageFile = (file) => {
    return new Promise((resolve) => {
      if (!file) resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  try {
    let featuredImageBase64 = null;
    if (featuredImage) {
      featuredImageBase64 = await processImageFile(featuredImage);
    }

    const processedContentBlocks = await Promise.all(
      contentBlocks.map(async (block) => {
        if (block.type === "image" && block.data.file) {
          const base64 = await processImageFile(block.data.file);
          return {
            ...block,
            data: {
              ...block.data,
              url: base64
            }
          };
        }
        return block;
      })
    );

    const blogData = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      excerpt: form.excerpt,
      anchorTags: form.anchorTags,
      categories: form.categories.map(cat => ({
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, "-")
      })),
      tags: form.tags,
      seo: {
        ...form.seo,
        keywords: form.seo.keywords.split(',').map(k => k.trim()).filter(k => k)
      },
      published: form.published,
      isFeatured: form.isFeatured,
      content: processedContentBlocks
    };

    if (featuredImageBase64) {
      blogData.featuredImage = {
        url: featuredImageBase64,
        alt: form.title || ""
      };
    } else if (featuredImageUrl) {
      blogData.featuredImage = {
        url: featuredImageUrl,
        alt: form.title || ""
      };
    }

    console.log("📝 Blog data being sent:", blogData);

    // Use the onSubmit prop instead of calling API directly
    await onSubmit(blogData);
    
  } catch (err) {
    console.log("❌ BLOG CREATE ERROR:", err.response?.data || err.message);
    alert(`Error creating blog: ${err.response?.data?.message || err.message}`);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl font-bold"
        title="Cancel & Go Back"
      >
        ✕
      </button>

      <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <input 
          name="title" 
          value={form.title}
          placeholder="Enter your blog post title here" 
          className="w-full border p-2 rounded" 
          onChange={handleInput} 
        />

        {/* Slug */}
        <input 
          name="slug" 
          value={form.slug}
          placeholder="Custom URL name (e.g., best-laptop-2024)" 
          className="w-full border p-2 rounded" 
          onChange={handleInput} 
        />

        {/* Description */}
        <textarea 
          name="description" 
          value={form.description}
          placeholder="Brief summary of your blog post" 
          className="w-full border p-2 rounded" 
          onChange={handleInput} 
        />

        {/* Excerpt */}
        <textarea 
          name="excerpt" 
          value={form.excerpt}
          placeholder="Short preview text for blog listings" 
          className="w-full border p-2 rounded" 
          onChange={handleInput} 
        />

        {/* Categories */}
        <div className="border p-3 rounded">
          <h2 className="font-semibold mb-2">Categories (Select Multiple)</h2>
          <select 
            className="w-full border p-2 rounded h-32" 
            multiple 
            value={form.categories}
            onChange={handleCategorySelect}
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Tags</h2>
          <div className="flex gap-3">
            <input 
              className="border p-2 flex-1" 
              value={tagInput} 
              onChange={(e)=>setTagInput(e.target.value)} 
            />
            <button type="button" onClick={addTag} className="bg-blue-500 text-white px-3 rounded">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {form.tags.map(tag => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-red-500 font-bold">x</button>
              </span>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">SEO Settings</h2>
          <input 
            name="title" 
            value={form.seo.title}
            placeholder="SEO Title" 
            className="w-full border p-2 rounded" 
            onChange={handleSEOInput} 
          />
          <textarea 
            name="description" 
            value={form.seo.description}
            placeholder="SEO Description" 
            className="w-full border p-2 rounded" 
            onChange={handleSEOInput} 
          />
          <input 
            name="keywords" 
            value={form.seo.keywords}
            placeholder="Keywords (comma separated)" 
            className="w-full border p-2 rounded" 
            onChange={handleSEOInput} 
          />
          <input 
            name="canonicalUrl" 
            value={form.seo.canonicalUrl}
            placeholder="Original post link (if republishing)" 
            className="w-full border p-2 rounded" 
            onChange={handleSEOInput} 
          />
        </div>

{/* Featured Image */}
<div className="border p-4 rounded-lg space-y-4 bg-white shadow-sm">

  <h2 className="font-semibold text-lg">Featured Image</h2>

  {/* Preview */}
  {featuredPreview && (
    <div className="flex justify-center">
      <img
        src={featuredPreview}
        alt="Featured preview"
        className="w-20 h-20 object-cover rounded-lg border shadow-sm"
      />
    </div>
  )}

  {/* Upload Button */}
  <label className="flex flex-col items-center justify-center w-full p-3 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
      📁 Upload Image
    </span>

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFeaturedImageUpload}
    />
  </label>

  <div className="text-center text-xs text-gray-500">— OR —</div>

  {/* URL Input */}
  <input
    type="text"
    placeholder="Paste image URL here"
    className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
    value={featuredImageUrl}
    onChange={handleFeaturedImageUrl}
  />

</div>



        {/* Content Blocks - FIXED */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Content Blocks</h2>
          <div className="flex gap-2 flex-wrap">
            {["paragraph", "heading", "quote", "link", "list", "image"].map(type => (
              <button key={type} type="button" className="bg-gray-200 px-2 py-1 rounded" onClick={() => addContentBlock(type)}>
                + {type}
              </button>
            ))}
          </div>

          {contentBlocks.map((block, index) => (
            <div key={index} className="border rounded p-3 mt-2">
              <h3 className="font-medium">Block: {block.type}</h3>

              {block.type !== "list" && block.type !== "image" && (
                <textarea 
                  placeholder="Type your content here..." 
                  className="w-full border p-2 rounded mt-2"
                  value={block.data.text?.[0]?.value || ""}
                  onChange={(e) => updateBlockText(index, e.target.value)} 
                />
              )}

              {block.type === "list" && (
                <textarea 
                  placeholder="List items, one per line" 
                  className="w-full border p-2 rounded mt-2"
                  value={Array.isArray(block.data.items) ? block.data.items.join('\n') : ""}
                  onChange={(e) => updateBlockData(index, "items", e.target.value.split("\n"))} 
                />
              )}

              {block.type === "link" && (
                <input 
                  placeholder="Paste website link here" 
                  className="w-full border p-2 rounded mt-2"
                  value={block.data.url || ""}
                  onChange={(e) => updateBlockData(index, "url", e.target.value)} 
                />
              )}

              {block.type === "image" && (
  <div className="mt-3 space-y-3 p-3 border rounded-lg bg-white shadow-sm">

    {/* Preview */}
    {block.data.url && (
      <div className="flex justify-center">
        <img
          src={block.data.url}
          alt="Content"
          className="w-36 h-36 object-cover rounded-lg border shadow-sm"
        />
      </div>
    )}

    {/* Upload Button */}
    <label className="flex flex-col items-center justify-center w-full p-3 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
        📁 Upload Image
      </span>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleBlockImageUpload(index, e.target.files[0])}
      />
    </label>

    <div className="text-center text-xs text-gray-500">— OR —</div>

    {/* URL Input */}
    <input
      type="text"
      placeholder="Paste image URL here"
      className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
      value={block.data.url || ""}
      onChange={(e) => updateBlockData(index, "url", e.target.value)}
    />
  </div>
)}

            </div>
          ))}
        </div>

        {/* Anchor Tags Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Anchor Tags</h2>

          <div className="space-y-4">
            {form.anchorTags?.map((anchor, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Word/Phrase
                    </label>
                    <input
                      type="text"
                      value={anchor.word}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Link
                    </label>
                    <input
                      type="text"
                      value={anchor.link}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      anchor.isExternal
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {anchor.isExternal ? "External" : "Internal"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          anchorTags: prev.anchorTags.filter((_, i) => i !== index)
                        }));
                      }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove anchor tag"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Anchor Tag Form */}
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Add New Anchor Tag
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Word/Phrase *
                  </label>
                  <input
                    type="text"
                    value={newAnchorTag.word}
                    onChange={(e) =>
                      setNewAnchorTag((prev) => ({
                        ...prev,
                        word: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., best features"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Link URL *
                  </label>
                  <input
                    type="url"
                    value={newAnchorTag.link}
                    onChange={(e) =>
                      setNewAnchorTag((prev) => ({
                        ...prev,
                        link: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., https://example.com/features"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newAnchorTag.isExternal}
                    onChange={(e) =>
                      setNewAnchorTag((prev) => ({
                        ...prev,
                        isExternal: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    id="isExternal"
                  />
                  <label
                    htmlFor="isExternal"
                    className="ml-2 text-sm font-medium text-gray-800"
                  >
                    External Link (opens in new tab)
                  </label>
                </div>

                <button
                  type="button"
                  onClick={addAnchorTag}
                  disabled={
                    !newAnchorTag.word.trim() || !newAnchorTag.link.trim()
                  }
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <LinkIcon size={16} />
                  Add Anchor Tag
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Anchor tags will be automatically converted to links in your
                product description and content.
                {newAnchorTag.isExternal &&
                  " External links will open in a new tab."}
              </p>
            </div>

            {/* Anchor Tags Summary */}
            {form.anchorTags?.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    Total anchor tags:{" "}
                    <strong>{form.anchorTags.length}</strong>
                  </span>
                  <span className="text-sm text-blue-800">
                    External:{" "}
                    <strong>
                      {form.anchorTags.filter((a) => a.isExternal).length}
                    </strong>{" "}
                    | Internal:{" "}
                    <strong>
                      {form.anchorTags.filter((a) => !a.isExternal).length}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Publish Settings */}
        <div className="flex gap-5">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.published}
              onChange={(e)=>setForm(prev => ({...prev, published: e.target.checked}))} 
            /> 
            Publish
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.isFeatured}
              onChange={(e)=>setForm(prev => ({...prev, isFeatured: e.target.checked}))} 
            /> 
            Feature This Blog
          </label>
        </div>

        {/* Submit */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Create Blog</button>

      </form>
    </div>
  );
}