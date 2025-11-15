"use client";
import React, { useState, useEffect } from "react";

export default function BlogForm({ onSubmit, editingData }) {
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    shortDescription: "",
    content: "",
    coverImage: "",
    category: "",
    tags: "",
    images: "",
    seo: { metaTitle: "", metaDescription: "", keywords: "" }
  });

  const [steps, setSteps] = useState([{ title: "", description: "", image: "" }]);

  useEffect(() => {
    if (editingData) {
      setFormData({
        title: editingData.title,
        authorName: editingData.authorName,
        shortDescription: editingData.shortDescription,
        content: editingData.content,
        coverImage: editingData.coverImage,
        category: editingData.category,
        tags: editingData.tags.join(", "),
        images: editingData.images.join(", "),
        seo: {
          metaTitle: editingData.seo.metaTitle,
          metaDescription: editingData.seo.metaDescription,
          keywords: editingData.seo.keywords.join(", ")
        }
      });
      setSteps(editingData.steps);
    }
  }, [editingData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSEOChange = (e) =>
    setFormData({ ...formData, seo: { ...formData.seo, [e.target.name]: e.target.value } });

  const handleStepChange = (i, e) => {
    const updated = [...steps];
    updated[i][e.target.name] = e.target.value;
    setSteps(updated);
  };

  const addStep = () =>
    setSteps([...steps, { title: "", description: "", image: "" }]);

  const removeStep = (i) =>
    setSteps(steps.filter((_, index) => index !== i));

  const submitHandler = (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
      images: formData.images.split(",").map((i) => i.trim()),
      seo: {
        metaTitle: formData.seo.metaTitle,
        metaDescription: formData.seo.metaDescription,
        keywords: formData.seo.keywords.split(",").map((k) => k.trim()),
      },
      steps,
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={submitHandler} className="bg-white border rounded p-5 mt-5 space-y-4">

      <input placeholder="Blog Title" className="input" name="title" value={formData.title} onChange={handleChange} required />

      <input placeholder="Author Name" className="input" name="authorName" value={formData.authorName} onChange={handleChange} required />

      <input placeholder="Short Description" className="input" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required />

      <textarea placeholder="Full Content" className="input" name="content" value={formData.content} onChange={handleChange} required />

      <input placeholder="Cover Image URL" className="input" name="coverImage" value={formData.coverImage} onChange={handleChange} />

      <input placeholder="Category" className="input" name="category" value={formData.category} onChange={handleChange} required />

      <input placeholder="Tags (comma separated)" className="input" name="tags" value={formData.tags} onChange={handleChange} />

      <input placeholder="Extra Images (comma separated)" className="input" name="images" value={formData.images} onChange={handleChange} />

      {/* SEO Section */}
      <div className="p-3 border rounded">
        <h3 className="font-semibold mb-2">SEO</h3>
        <input placeholder="Meta Title" className="input" name="metaTitle" value={formData.seo.metaTitle} onChange={handleSEOChange} />
        <input placeholder="Meta Description" className="input" name="metaDescription" value={formData.seo.metaDescription} onChange={handleSEOChange} />
        <input placeholder="Keywords (comma separated)" className="input" name="keywords" value={formData.seo.keywords} onChange={handleSEOChange} />
      </div>

      {/* Steps */}
      <div className="p-3 border rounded">
        <h3 className="font-semibold mb-2">Steps</h3>
        {steps.map((step, index) => (
          <div key={index} className="mb-3 p-2 border rounded">
            <input name="title" placeholder="Step Title" className="input" value={step.title} onChange={(e) => handleStepChange(index, e)} />
            <input name="description" placeholder="Step Description" className="input" value={step.description} onChange={(e) => handleStepChange(index, e)} />
            <input name="image" placeholder="Step Image URL" className="input" value={step.image} onChange={(e) => handleStepChange(index, e)} />
            {steps.length > 1 && (
              <button type="button" className="text-red-600" onClick={() => removeStep(index)}>
                Remove Step
              </button>
            )}
          </div>
        ))}
        <button type="button" className="bg-gray-700 text-white px-3 py-1 rounded" onClick={addStep}>+ Add Step</button>
      </div>

      <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">
        {editingData ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
}
