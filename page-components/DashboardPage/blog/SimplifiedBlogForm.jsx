"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { 
  Upload, Plus, Trash2, MoveUp, MoveDown, Save, X, Eye, 
  Type, Quote, Link2, List, Image as ImageIcon, Heading2
} from "lucide-react";

// Available categories
const CATEGORIES = [
  "Food", "Tools", "Sports", "Pets", "Outdoor", "Office", "Money", "Health",
  "Gifts", "Home", "Garden", "Tech", "Fitness", "Fashion", "Beauty", "Baby"
];

// Content block types with icons
const BLOCK_TYPES = [
  { type: "paragraph", label: "Paragraph", icon: Type },
  { type: "heading", label: "Heading", icon: Heading2 },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "link", label: "Link", icon: Link2 },
  { type: "list", label: "List", icon: List },
  { type: "image", label: "Image", icon: ImageIcon },
];

// Simple input component
const FormInput = memo(function FormInput({ label, name, value, onChange, placeholder, required, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
});

// Simple textarea component
const FormTextarea = memo(function FormTextarea({ label, name, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
});

// Image upload component
const ImageUpload = memo(function ImageUpload({ label, preview, onFileChange, onUrlChange, urlValue }) {
  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {preview && (
        <div className="flex justify-center">
          <img src={preview} alt="Preview" className="max-h-40 rounded-lg shadow-md" />
        </div>
      )}
      
      <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
        <Upload className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-600">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </label>
      
      <div className="text-center text-xs text-gray-400">— or paste URL —</div>
      
      <input
        type="url"
        value={urlValue}
        onChange={onUrlChange}
        placeholder="https://example.com/image.jpg"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
});

// Content block component
const ContentBlock = memo(function ContentBlock({ block, index, total, onUpdate, onRemove, onMove }) {
  const blockConfig = BLOCK_TYPES.find(b => b.type === block.type);
  const Icon = blockConfig?.icon || Type;

  const renderBlockInput = () => {
    switch (block.type) {
      case "paragraph":
      case "heading":
      case "quote":
        return (
          <textarea
            value={block.data?.text?.[0]?.value || ""}
            onChange={(e) => onUpdate(index, "text", [{ type: "text", value: e.target.value }])}
            placeholder={`Enter ${block.type} content...`}
            rows={block.type === "paragraph" ? 4 : 2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
        );
      
      case "link":
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.data?.text?.[0]?.value || ""}
              onChange={(e) => onUpdate(index, "text", [{ type: "text", value: e.target.value }])}
              placeholder="Link text (e.g., Click here)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              value={block.data?.url || ""}
              onChange={(e) => onUpdate(index, "url", e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      
      case "list":
        return (
          <textarea
            value={Array.isArray(block.data?.items) ? block.data.items.join("\n") : ""}
            onChange={(e) => onUpdate(index, "items", e.target.value.split("\n"))}
            placeholder="Enter list items (one per line)"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        );
      
      case "image":
        return (
          <div className="space-y-3">
            {block.data?.url && (
              <div className="flex justify-center">
                <img src={block.data.url} alt="Preview" className="max-h-32 rounded-lg" />
              </div>
            )}
            <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Upload image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => onUpdate(index, "url", reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            <input
              type="url"
              value={block.data?.url?.startsWith("data:") ? "" : block.data?.url || ""}
              onChange={(e) => onUpdate(index, "url", e.target.value)}
              placeholder="Or paste image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={block.data?.alt || ""}
              onChange={(e) => onUpdate(index, "alt", e.target.value)}
              placeholder="Image alt text (for SEO)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Block Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 capitalize">{block.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(index, "up")}
            disabled={index === 0}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            title="Move up"
          >
            <MoveUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, "down")}
            disabled={index === total - 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            title="Move down"
          >
            <MoveDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 text-red-400 hover:text-red-600"
            title="Remove block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Block Content */}
      <div className="p-4">
        {renderBlockInput()}
      </div>
    </div>
  );
});

// Main Form Component
export default function SimplifiedBlogForm({ initialData = null, onSubmit, onCancel, isLoading = false }) {
  const isEditMode = !!initialData;

  // Form state
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    categories: [],
    tags: [],
    seo: { title: "", description: "", keywords: "" },
    isFeatured: false,
    published: false,
  });

  // Featured image state
  const [featuredImage, setFeaturedImage] = useState({ url: "", preview: "" });
  
  // Content blocks state
  const [contentBlocks, setContentBlocks] = useState([]);
  
  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        excerpt: initialData.excerpt || "",
        categories: initialData.categories?.map(c => c.name || c) || [],
        tags: initialData.tags || [],
        seo: {
          title: initialData.seo?.title || "",
          description: initialData.seo?.description || "",
          keywords: Array.isArray(initialData.seo?.keywords) 
            ? initialData.seo.keywords.join(", ") 
            : initialData.seo?.keywords || "",
        },
        isFeatured: initialData.isFeatured || false,
        published: initialData.published || false,
      });

      if (initialData.featuredImage?.url) {
        setFeaturedImage({
          url: initialData.featuredImage.url,
          preview: initialData.featuredImage.url,
        });
      }

      if (initialData.content) {
        setContentBlocks(initialData.content.map(block => ({
          ...block,
          data: {
            ...block.data,
            text: Array.isArray(block.data?.text) ? block.data.text : [{ type: "text", value: "" }],
          },
        })));
      }
    }
  }, [initialData]);

  // Generate slug from title
  const generateSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }, []);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from title (only for new blogs)
    if (name === "title" && !isEditMode) {
      setForm(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  }, [isEditMode, generateSlug]);

  // Handle SEO input changes
  const handleSeoChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }));
  }, []);

  // Handle category toggle
  const toggleCategory = useCallback((category) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  // Handle tag add
  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  }, [tagInput, form.tags]);

  // Handle tag remove
  const removeTag = useCallback((tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }, []);

  // Handle featured image
  const handleFeaturedImageFile = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFeaturedImage({ url: reader.result, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFeaturedImageUrl = useCallback((e) => {
    const url = e.target.value;
    setFeaturedImage({ url, preview: url });
  }, []);

  // Content block handlers
  const addBlock = useCallback((type) => {
    setContentBlocks(prev => [...prev, {
      type,
      data: { text: [{ type: "text", value: "" }], url: "", items: [], alt: "" },
    }]);
  }, []);

  const updateBlock = useCallback((index, field, value) => {
    setContentBlocks(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        data: { ...updated[index].data, [field]: value },
      };
      return updated;
    });
  }, []);

  const removeBlock = useCallback((index) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const moveBlock = useCallback((index, direction) => {
    setContentBlocks(prev => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  }, []);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogData = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      excerpt: form.excerpt,
      categories: form.categories.map(cat => ({
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, "-"),
      })),
      tags: form.tags,
      seo: {
        title: form.seo.title || form.title,
        description: form.seo.description || form.excerpt,
        keywords: form.seo.keywords.split(",").map(k => k.trim()).filter(Boolean),
      },
      isFeatured: form.isFeatured,
      published: form.published,
      content: contentBlocks,
    };

    // Add featured image if present
    if (featuredImage.url) {
      blogData.featuredImage = {
        url: featuredImage.url,
        alt: form.title,
      };
    }

    await onSubmit(blogData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {/* Basic Info Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
        
        <FormInput
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          required
        />
        
        <FormInput
          label="Slug (URL)"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="blog-post-url"
          required
        />
        
        <FormTextarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief description of the blog post"
        />
        
        <FormTextarea
          label="Excerpt"
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Short preview text shown in listings"
          rows={2}
        />
      </section>

      {/* Categories Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                form.categories.includes(cat)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {form.categories.length > 0 && (
          <p className="text-sm text-gray-500">
            Selected: {form.categories.join(", ")}
          </p>
        )}
      </section>

      {/* Tags Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Tags</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add a tag"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-red-500 hover:text-red-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Featured Image Section */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Featured Image</h2>
        <ImageUpload
          label="Upload or paste URL"
          preview={featuredImage.preview}
          onFileChange={handleFeaturedImageFile}
          onUrlChange={handleFeaturedImageUrl}
          urlValue={featuredImage.url?.startsWith("data:") ? "" : featuredImage.url}
        />
      </section>

      {/* Content Blocks Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Content Blocks</h2>
        
        {/* Add Block Buttons */}
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Block List */}
        <div className="space-y-4">
          {contentBlocks.map((block, index) => (
            <ContentBlock
              key={index}
              block={block}
              index={index}
              total={contentBlocks.length}
              onUpdate={updateBlock}
              onRemove={removeBlock}
              onMove={moveBlock}
            />
          ))}
        </div>

        {contentBlocks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No content blocks yet. Click a button above to add content.</p>
          </div>
        )}
      </section>

      {/* SEO Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">SEO Settings</h2>
        
        <FormInput
          label="SEO Title"
          name="title"
          value={form.seo.title}
          onChange={handleSeoChange}
          placeholder="Leave blank to use blog title"
        />
        
        <FormTextarea
          label="SEO Description"
          name="description"
          value={form.seo.description}
          onChange={handleSeoChange}
          placeholder="Leave blank to use excerpt"
          rows={2}
        />
        
        <FormInput
          label="Keywords (comma separated)"
          name="keywords"
          value={form.seo.keywords}
          onChange={handleSeoChange}
          placeholder="keyword1, keyword2, keyword3"
        />
      </section>

      {/* Publish Settings */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Publish Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Publish immediately</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Feature this post</span>
          </label>
        </div>
      </section>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Saving..." : isEditMode ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
}
