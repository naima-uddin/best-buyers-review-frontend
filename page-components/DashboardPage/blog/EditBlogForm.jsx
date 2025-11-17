"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api/axios";

export default function EditBlogForm({ editingData, onSubmit, onCancel }) {
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
    seo: { title: "", description: "", keywords: [], canonicalUrl: "" },
    isFeatured: false,
    published: false
  });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState(null);

  const [tagInput, setTagInput] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);

  // Populate form with editing data
  useEffect(() => {
    if (editingData) {
      setForm({
        title: editingData.title || "",
        slug: editingData.slug || "",
        description: editingData.description || "",
        excerpt: editingData.excerpt || "",
        author: {
          name: editingData.author?.name || "",
          avatar: editingData.author?.avatar || "",
          bio: editingData.author?.bio || ""
        },
        categories: editingData.categories?.map(cat => cat.name) || [],
        tags: editingData.tags || [],
        seo: {
          title: editingData.seo?.title || "",
          description: editingData.seo?.description || "",
          keywords: Array.isArray(editingData.seo?.keywords) 
            ? editingData.seo.keywords.join(', ') 
            : editingData.seo?.keywords || "",
          canonicalUrl: editingData.seo?.canonicalUrl || ""
        },
        isFeatured: editingData.isFeatured || false,
        published: editingData.published || false
      });

      // Set featured image preview
      if (editingData.featuredImage?.url) {
        if (editingData.featuredImage.url.startsWith('data:')) {
          setFeaturedPreview(editingData.featuredImage.url);
        } else {
          setFeaturedImageUrl(editingData.featuredImage.url);
          setFeaturedPreview(editingData.featuredImage.url);
        }
      }

      // Set content blocks
      if (editingData.content && Array.isArray(editingData.content)) {
        setContentBlocks(editingData.content.map(block => ({
          ...block,
          data: {
            ...block.data,
            // Ensure text array structure
            text: Array.isArray(block.data.text) ? block.data.text : [{ type: "text", value: "" }]
          }
        })));
      }
    }
  }, [editingData]);

  // ----------- Input Handlers --------------
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAuthorInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      author: { ...prev.author, [name]: value }
    }));
  };

  const handleSEOInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      seo: { 
        ...prev.seo, 
        [name]: name === 'keywords' ? value : value 
      }
    }));
  };

  const handleCategorySelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
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
    const url = e.target.value;
    setFeaturedImageUrl(url);
    setFeaturedImage(null);
    setFeaturedPreview(url);
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
      data: { 
        text: [{ type: "text", value: "" }], 
        url: "", 
        items: [],
        alt: ""
      }
    };
    setContentBlocks(prev => [...prev, newBlock]);
  };

  const updateBlockData = (index, field, value) => {
    const updated = [...contentBlocks];
    updated[index].data[field] = value;
    setContentBlocks(updated);
  };

  const updateBlockText = (index, textIndex, value) => {
    const updated = [...contentBlocks];
    if (!updated[index].data.text) {
      updated[index].data.text = [{ type: "text", value: "" }];
    }
    updated[index].data.text[textIndex].value = value;
    setContentBlocks(updated);
  };

  const removeContentBlock = (index) => {
    const updated = [...contentBlocks];
    updated.splice(index, 1);
    setContentBlocks(updated);
  };

  const moveContentBlock = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contentBlocks.length - 1)
    ) return;

    const updated = [...contentBlocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setContentBlocks(updated);
  };

  // ----------- Submit --------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert images to base64 before sending
    const processImageFile = (file) => {
      return new Promise((resolve) => {
        if (!file) resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    };

    try {
      // Process featured image
      let featuredImageBase64 = null;
      if (featuredImage) {
        featuredImageBase64 = await processImageFile(featuredImage);
      }

      // Process content block images
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

      // Prepare the blog data object
      const blogData = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        excerpt: form.excerpt,
        author: form.author,
        categories: form.categories.map(cat => ({
          name: cat,
          slug: cat.toLowerCase().replace(/\s+/g, "-")
        })),
        tags: form.tags,
        seo: {
          ...form.seo,
          keywords: typeof form.seo.keywords === 'string' 
            ? form.seo.keywords.split(',').map(k => k.trim()).filter(k => k)
            : form.seo.keywords
        },
        published: form.published,
        isFeatured: form.isFeatured,
        content: processedContentBlocks
      };

      // Add featured image data
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
      } else if (editingData.featuredImage?.url && !featuredImage && !featuredImageUrl) {
        // Keep existing featured image if not changed
        blogData.featuredImage = editingData.featuredImage;
      }

      console.log("Submitting blog data:", blogData);

      // Submit the form
      await onSubmit(blogData);

    } catch (err) {
      console.log("BLOG UPDATE ERROR:", err.response?.data || err.message);
      alert("Error updating blog.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input 
            name="title" 
            value={form.title}
            placeholder="Enter your blog post title here" 
            className="w-full border p-2 rounded" 
            onChange={handleInput} 
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input 
            name="slug" 
            value={form.slug}
            placeholder="Custom URL name (e.g., best-laptop-2024)" 
            className="w-full border p-2 rounded" 
            onChange={handleInput} 
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea 
            name="description" 
            value={form.description}
            placeholder="Brief summary of your blog post" 
            className="w-full border p-2 rounded" 
            onChange={handleInput} 
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <textarea 
            name="excerpt" 
            value={form.excerpt}
            placeholder="Short preview text for blog listings" 
            className="w-full border p-2 rounded" 
            onChange={handleInput} 
          />
        </div>

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
          <div className="mt-2">
            <strong>Selected:</strong> {form.categories.join(', ')}
          </div>
        </div>

        {/* Tags */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Tags</h2>
          <div className="flex gap-3">
            <input 
              className="border p-2 flex-1" 
              value={tagInput} 
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add new tag"
            />
            <button type="button" onClick={addTag} className="bg-blue-500 text-white px-3 rounded">
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {form.tags.map(tag => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-2">
                {tag}
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)} 
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Author */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Author Information</h2>
          <input 
            name="name" 
            value={form.author.name}
            placeholder="our name or writer's name" 
            className="w-full border p-2 rounded" 
            onChange={handleAuthorInput} 
          />
          <input 
            name="avatar" 
            value={form.author.avatar}
            placeholder="Profile picture link" 
            className="w-full border p-2 rounded" 
            onChange={handleAuthorInput} 
          />
          <textarea 
            name="bio" 
            value={form.author.bio}
            placeholder="Author Bio" 
            className="w-full border p-2 rounded" 
            onChange={handleAuthorInput} 
          />
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
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Featured Image</h2>
          <p className="text-sm opacity-70">Upload OR enter URL</p>

          <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} />
          <input 
            type="text" 
            placeholder="Or paste image URL" 
            className="w-full border p-2 rounded" 
            value={featuredImageUrl} 
            onChange={handleFeaturedImageUrl} 
          />

          {featuredPreview && (
            <div className="mt-2">
              <img src={featuredPreview} className="w-40 h-40 object-cover rounded border" />
              <p className="text-sm text-gray-600 mt-1">Current preview</p>
            </div>
          )}
        </div>

        {/* Content Blocks */}
        <div className="border p-3 rounded space-y-2">
          <h2 className="font-semibold">Content Blocks</h2>

          <div className="flex gap-2 flex-wrap mb-4">
            {["paragraph", "heading", "quote", "link", "list", "image"].map(type => (
              <button 
                key={type} 
                type="button" 
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300" 
                onClick={() => addContentBlock(type)}
              >
                + {type}
              </button>
            ))}
          </div>

          {contentBlocks.map((block, index) => (
            <div key={index} className="border rounded p-3 mt-2 relative">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Block: {block.type}</h3>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => moveContentBlock(index, 'up')}
                    className="text-blue-500 text-sm"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button 
                    type="button" 
                    onClick={() => moveContentBlock(index, 'down')}
                    className="text-blue-500 text-sm"
                    disabled={index === contentBlocks.length - 1}
                  >
                    ↓
                  </button>
                  <button 
                    type="button" 
                    onClick={() => removeContentBlock(index)}
                    className="text-red-500 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>

              {block.type !== "list" && block.type !== "image" && (
                <textarea 
                  placeholder="Type your content here..." 
                  className="w-full border p-2 rounded mt-2"
                  value={block.data.text?.[0]?.value || ""}
                  onChange={(e) => updateBlockText(index, 0, e.target.value)} 
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
                <div className="mt-2 space-y-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const updated = [...contentBlocks];
                        updated[index].data.file = file;
                        updated[index].data.url = URL.createObjectURL(file);
                        setContentBlocks(updated);
                      }
                    }} 
                  />
                  <input 
                    placeholder="Or paste image URL" 
                    className="w-full border p-2 rounded"
                    value={block.data.url || ""}
                    onChange={(e) => updateBlockData(index, "url", e.target.value)} 
                  />
                  {block.data.url && (
                    <img src={block.data.url} className="w-32 h-32 object-cover rounded border" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Publish Settings */}
        <div className="flex gap-5">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.published}
              onChange={(e) => setForm(prev => ({...prev, published: e.target.checked}))} 
            /> 
            Publish
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.isFeatured}
              onChange={(e) => setForm(prev => ({...prev, isFeatured: e.target.checked}))} 
            /> 
            Feature This Blog
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Blog
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}