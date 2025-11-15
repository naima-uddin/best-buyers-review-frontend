"use client";
import React, { useState, useEffect } from "react";

export default function BlogForm({ onSubmit, editingData }) {
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

  const [contentImages, setContentImages] = useState([""]);

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
      setContentImages(editingData.contentImages || []);
    }
  }, [editingData]);

  function handleBasicChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function toggleCheckbox(name) {
    setFormData({ ...formData, [name]: !formData[name] });
  }

  function handleContentBlockChange(index, field, value) {
    const updated = [...contentBlocks];
    updated[index].data.text[0].value = value;
    setContentBlocks(updated);
  }

  function addContentBlock() {
    setContentBlocks([
      ...contentBlocks,
      { type: "paragraph", data: { text: [{ value: "" }], items: [] } },
    ]);
  }

  function removeContentBlock(index) {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  }

  function handleContentImageChange(index, val) {
    const updated = [...contentImages];
    updated[index] = val;
    setContentImages(updated);
  }

  function addContentImage() {
    setContentImages([...contentImages, ""]);
  }

  function removeContentImage(index) {
    setContentImages(contentImages.filter((_, i) => i !== index));
  }

  const submitHandler = (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      excerpt: formData.excerpt,
      featuredImage: {
        url: formData.featuredImageUrl,
        public_id: formData.featuredImagePublicId,
      },
      content: contentBlocks,
      categories: formData.categories.split(",").map((c) => c.trim()),
      tags: formData.tags.split(",").map((t) => t.trim()),
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
        keywords: formData.seoKeywords.split(",").map((k) => k.trim()),
        canonicalUrl: formData.seoCanonicalUrl,
      },
      contentImages: contentImages.map((i) => ({
        url: i,
        public_id: "",
      })),
      isFeatured: formData.isFeatured,
      published: formData.published,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={submitHandler} className="p-5 border rounded bg-white space-y-5">

      {/* Basic Fields */}
      <input className="input" placeholder="Blog Title" name="title" value={formData.title} onChange={handleBasicChange} required />
      <textarea className="input" placeholder="Description" name="description" value={formData.description} onChange={handleBasicChange} required />
      <textarea className="input" placeholder="Excerpt" name="excerpt" value={formData.excerpt} onChange={handleBasicChange} maxLength={200} />

      {/* Author */}
      <div className="border p-3 rounded">
        <h3 className="font-semibold mb-2">Author</h3>
        <input className="input" name="authorName" placeholder="Author Name" value={formData.authorName} onChange={handleBasicChange} required />
        <input className="input" name="authorAvatar" placeholder="Author Avatar URL" value={formData.authorAvatar} onChange={handleBasicChange} />
        <textarea className="input" name="authorBio" placeholder="Author Bio" value={formData.authorBio} onChange={handleBasicChange} />
      </div>

      {/* Categories & Tags */}
      <input className="input" name="categories" placeholder="Categories (comma separated)" value={formData.categories} onChange={handleBasicChange} />
      <input className="input" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleBasicChange} />

      {/* Featured Image */}
      <input className="input" name="featuredImageUrl" placeholder="Featured Image URL" value={formData.featuredImageUrl} onChange={handleBasicChange} />

      {/* Content Blocks */}
      <div className="border p-3 rounded">
        <h3 className="font-semibold mb-2">Content Blocks</h3>
        {contentBlocks.map((block, index) => (
          <div key={index} className="p-2 border mb-2 rounded">
            <textarea
              className="input"
              placeholder="Paragraph Content"
              value={block.data.text[0].value}
              onChange={(e) => handleContentBlockChange(index, "text", e.target.value)}
            />
            {contentBlocks.length > 1 && (
              <button type="button" className="text-red-500 mt-1" onClick={() => removeContentBlock(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="bg-gray-700 text-white px-3 py-1 rounded" onClick={addContentBlock}>
          + Add Content Block
        </button>
      </div>

      {/* Content Images */}
      <div className="border p-3 rounded">
        <h3 className="font-semibold mb-2">Content Images</h3>
        {contentImages.map((image, index) => (
          <div key={index} className="p-2 border mb-2 rounded">
            <input
              className="input"
              placeholder="Image URL"
              value={image}
              onChange={(e) => handleContentImageChange(index, e.target.value)}
            />
            {contentImages.length > 1 && (
              <button type="button" className="text-red-500 mt-1" onClick={() => removeContentImage(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="bg-gray-700 text-white px-3 py-1 rounded" onClick={addContentImage}>
          + Add Image
        </button>
      </div>

      {/* SEO */}
      <div className="border p-3 rounded">
        <h3 className="font-semibold mb-2">SEO Data</h3>
        <input className="input" name="seoTitle" placeholder="SEO Title" value={formData.seoTitle} onChange={handleBasicChange} />
        <input className="input" name="seoDescription" placeholder="SEO Description" value={formData.seoDescription} onChange={handleBasicChange} />
        <input className="input" name="seoKeywords" placeholder="Keywords (comma separated)" value={formData.seoKeywords} onChange={handleBasicChange} />
        <input className="input" name="seoCanonicalUrl" placeholder="Canonical URL" value={formData.seoCanonicalUrl} onChange={handleBasicChange} />
      </div>

      {/* Sponsor */}
      <div className="border p-3 rounded">
        <h3 className="font-semibold mb-2">Sponsor</h3>
        <input className="input" name="sponsorName" placeholder="Sponsor Name" value={formData.sponsorName} onChange={handleBasicChange} />
        <input className="input" name="sponsorLink" placeholder="Sponsor Link" value={formData.sponsorLink} onChange={handleBasicChange} />
        <input className="input" name="sponsorLogo" placeholder="Sponsor Logo URL" value={formData.sponsorLogo} onChange={handleBasicChange} />
      </div>

      {/* Settings */}
      <div className="p-3 border rounded flex gap-5">
        <label className="flex gap-2">
          <input type="checkbox" checked={formData.isFeatured} onChange={() => toggleCheckbox("isFeatured")} /> Featured
        </label>
        <label className="flex gap-2">
          <input type="checkbox" checked={formData.published} onChange={() => toggleCheckbox("published")} /> Publish Now
        </label>
      </div>

      <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">
        {editingData ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
}
