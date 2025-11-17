"use client";
import { useState } from "react";
import api from "@/lib/api/axios";

export default function CreateBlog() {
  const categoriesList = [
    "Food", "Tools", "Sports", "Pets", "Outdoor", "Office", "Money", "Health",
    "Gifts", "Home", "Garden", "Tech", "Fitness", "Fashion", "Beauty", "Baby"
  ];

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    author: { name: "", avatar: "", bio: "" },
    categories: [],
    tags: [],
    seo: { title: "", description: "", keywords: "", canonicalUrl: "" },
    isFeatured: false,
    published: false
  });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState(null);

  const [tagInput, setTagInput] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);

  // ----------- Input Handlers --------------
  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuthorInput = (e) =>
    setForm({ ...form, author: { ...form.author, [e.target.name]: e.target.value } });

  const handleSEOInput = (e) =>
    setForm({ ...form, seo: { ...form.seo, [e.target.name]: e.target.value } });

  const handleCategorySelect = (e) => {
    const selectedOptions = [...e.target.selectedOptions].map(o => o.value);
    setForm({ ...form, categories: selectedOptions });
  };

  // ----------- Featured Image (Upload OR URL) --------------
  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
    setFeaturedPreview(URL.createObjectURL(file));
    setFeaturedImageUrl(""); // disable URL if uploaded
  };

  const handleFeaturedImageUrl = (e) => {
    setFeaturedImageUrl(e.target.value);
    setFeaturedImage(null); // disable upload if URL provided
    setFeaturedPreview(e.target.value);
  };

  // ----------- Tags --------------
  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
    setTagInput("");
  };

  const removeTag = (tag) =>
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  // ----------- Content Blocks --------------
  const addContentBlock = (type) => {
    const newBlock = {
      type,
      data: { text: [{ value: "" }], url: "", items: [], alt: "", file: null }
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlockData = (index, field, value) => {
    const updated = [...contentBlocks];
    updated[index].data[field] = value;
    setContentBlocks(updated);
  };

  const handleBlockImageUpload = (index, file) => {
    const updated = [...contentBlocks];
    updated[index].data.file = file;
    updated[index].data.url = "";
    setContentBlocks(updated);
  };

  // ----------- Submit --------------
    const handleSubmit = async (e) => {
      e.preventDefault();

      const FD = new FormData();

      // ---- BASIC FIELDS ----
      FD.append("title", form.title);
      FD.append("slug", form.slug);
      FD.append("description", form.description);
      FD.append("excerpt", form.excerpt);
      FD.append("author", JSON.stringify(form.author));
      FD.append("seo", JSON.stringify(form.seo));
      FD.append("tags", JSON.stringify(form.tags));
      FD.append("published", form.published);
      FD.append("isFeatured", form.isFeatured);

      // ---- FIX CATEGORIES ----
      const mappedCategories = form.categories.map(cat => ({
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, "-")
      }));
      FD.append("categories", JSON.stringify(mappedCategories));

      // ---- FEATURE IMAGE ----
      if (featuredImage) FD.append("featuredImage", featuredImage);
      if (featuredImageUrl) FD.append("featuredImageUrl", featuredImageUrl);

      // ---- CONTENT IMAGES UPLOAD ----
      contentBlocks.forEach((block, i) => {
        if (block.type === "image" && block.data.file) {
          FD.append(`contentImage_${i}`, block.data.file);
        }
      });

      // ---- CLEAN JSON VERSION ----
      const sanitizedBlocks = contentBlocks.map(block => {
        const b = { ...block, data: { ...block.data } };
        delete b.data.file;
        return b;
      });

      FD.append("content", JSON.stringify(sanitizedBlocks));

      // ---- SUBMIT ----
      try {
        await api.post("/blog", FD, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Blog Created Successfully!");
        location.reload();
      } catch (err) {
        console.log("BLOG CREATE ERROR:", err.response?.data || err.message);
        alert("Error creating blog.");
      }
    };


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <input name="title" placeholder="Blog Title" className="w-full border p-2 rounded" onChange={handleInput} />

        {/* Slug */}
        <input name="slug" placeholder="URL Slug" className="w-full border p-2 rounded" onChange={handleInput} />

        {/* Description */}
        <textarea name="description" placeholder="Short Description" className="w-full border p-2 rounded" onChange={handleInput} />

        {/* Excerpt */}
        <textarea name="excerpt" placeholder="Excerpt" className="w-full border p-2 rounded" onChange={handleInput} />

        {/* Categories */}
        <div className="border p-3 rounded">
          <h2 className="font-semibold mb-2">Categories (Select Multiple)</h2>
          <select className="w-full border p-2 rounded h-32" multiple onChange={handleCategorySelect}>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Tags</h2>
          <div className="flex gap-3">
            <input className="border p-2 flex-1" value={tagInput} onChange={(e)=>setTagInput(e.target.value)} />
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

        {/* Author */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Author Information</h2>
          <input name="name" placeholder="Author Name" className="w-full border p-2 rounded" onChange={handleAuthorInput} />
          <input name="avatar" placeholder="Avatar Image URL" className="w-full border p-2 rounded" onChange={handleAuthorInput} />
          <textarea name="bio" placeholder="Author Bio" className="w-full border p-2 rounded" onChange={handleAuthorInput} />
        </div>

        {/* SEO */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">SEO Settings</h2>
          <input name="title" placeholder="SEO Title" className="w-full border p-2 rounded" onChange={handleSEOInput} />
          <textarea name="description" placeholder="SEO Description" className="w-full border p-2 rounded" onChange={handleSEOInput} />
          <input name="keywords" placeholder="Keywords (comma separated)" className="w-full border p-2 rounded" onChange={handleSEOInput} />
          <input name="canonicalUrl" placeholder="Canonical URL" className="w-full border p-2 rounded" onChange={handleSEOInput} />
        </div>

        {/* Featured Image */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Featured Image</h2>

          <p className="text-sm opacity-70">Upload OR enter URL</p>

          <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} />
          <input type="text" placeholder="Or paste image URL" className="w-full border p-2 rounded" value={featuredImageUrl} onChange={handleFeaturedImageUrl} />

          {featuredPreview && (<img src={featuredPreview} className="w-40 h-40 object-cover rounded border mt-2" />)}
        </div>

        {/* Content Blocks */}
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
                <textarea placeholder="Write content..." className="w-full border p-2 rounded mt-2"
                  onChange={(e) => updateBlockData(index, "text", [{ value: e.target.value }])} />
              )}

              {block.type === "list" && (
                <textarea placeholder="Enter list items (one per line)" className="w-full border p-2 rounded mt-2"
                  onChange={(e) => updateBlockData(index, "items", e.target.value.split("\n"))} />
              )}

              {block.type === "link" && (
                <input placeholder="Enter link URL" className="w-full border p-2 rounded mt-2"
                  onChange={(e) => updateBlockData(index, "url", e.target.value)} />
              )}

              {block.type === "image" && (
                <div className="mt-2 space-y-2">
                  <input type="file" accept="image/*" onChange={(e)=>handleBlockImageUpload(index, e.target.files[0])} />
                  <input placeholder="Or paste image URL" className="w-full border p-2 rounded"
                    onChange={(e)=>updateBlockData(index,"url",e.target.value)} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Publish Settings */}
        <div className="flex gap-5">
          <label className="flex items-center gap-2">
            <input type="checkbox" onChange={(e)=>setForm({...form, published: e.target.checked})} /> Publish
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" onChange={(e)=>setForm({...form, isFeatured: e.target.checked})} /> Feature This Blog
          </label>
        </div>

        {/* Submit */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Create Blog</button>

      </form>
    </div>
  );
}
