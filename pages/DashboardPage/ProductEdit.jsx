"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  LinkIcon,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function ProductEdit({ product, onSave, onCancel, onEdit }) {
  const [userRole, setUserRole] = useState("admin");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    brand: "",
    labels: [],
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    mainImage: "",
    affiliateUrl: "",
    isFeatured: false,
    isFullReview: false,

    // Pricing
    originalPrice: "",
    discountPrice: "",
    discountPercentage: "",

    // Custom Rating
    customRating: "",
    reviewCount: "",

    // Images - ENHANCED for sub-images
    subImages: [],

    // Features & Content
    features: [],
    colors: [],
    styles: [],
    specifications: [],
    customReviews: [],

    anchorTags: [],

    // SEO
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",

    // Description
    descriptionTitle: "",
    introduction: "",

    // Factors
    factorsToConsider: [],
    mostImportantFactorsHeading: "",
    mostImportantFactorsText: "",

    // Common Questions
    commonQuestions: [],

    // Conclusion
    conclusionHeading: "",
    conclusionText: "",
  });

  const [newSubImage, setNewSubImage] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newStyle, setNewStyle] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newFactor, setNewFactor] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newReview, setNewReview] = useState({
    author: "",
    rating: "",
    title: "",
    content: "",
  });
  const [newAnchorTag, setNewAnchorTag] = useState({
    word: "",
    link: "",
    isExternal: false,
  });
  const [expandedCategories, setExpandedCategories] = useState({
    main: true,
    sub: true,
    subsub: true,
  });

  // Toggle category sections
  const toggleCategorySection = (type) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Helper functions to get categories by level
  const getMainCategories = () => categories.filter((cat) => cat.level === 1);

  const getSubCategories = (mainCategoryId) => {
    if (!mainCategoryId) return [];
    const mainCategory = categories.find((cat) => cat._id === mainCategoryId);
    return mainCategory?.children || [];
  };

  const getSubSubCategories = (mainCategoryId, subCategoryId) => {
    if (!mainCategoryId || !subCategoryId) return [];
    const subCategories = getSubCategories(mainCategoryId);
    const subCategory = subCategories.find((sub) => sub._id === subCategoryId);
    return subCategory?.children || [];
  };

  useEffect(() => {
    if (product) {
      const mainImage =
        product.images?.find((img) => img.variant === "MAIN")?.url || "";
      const subImages =
        product.images
          ?.filter((img) => img.variant === "SUB")
          .map((img) => img.url) || [];

      // ✅ CORRECT: Get pricing from the new structure
      const originalPrice = product.listPrice?.amount || "";
      const discountPrice = product.price?.amount || "";

      // Calculate discount percentage if not provided
      let discountPercentage = product.discount?.percentage || 0;
      if (
        !discountPercentage &&
        originalPrice &&
        discountPrice &&
        originalPrice > discountPrice
      ) {
        discountPercentage = Math.round(
          ((originalPrice - discountPrice) / originalPrice) * 100
        );
      }

      setFormData({
        // Basic Information
        title: product.title || "",
        brand: product.brand || "",
        mainCategory: product.mainCategory?._id || product.mainCategory || "",
        subCategory: product.subCategory?._id || product.subCategory || "",
        subSubCategory:
          product.subSubCategory?._id || product.subSubCategory || "",
        labels: product.labels || [],
        mainImage: mainImage || "",
        affiliateUrl: product.affiliateUrl || "",
        isFeatured: product.isFeatured || false,
        isFullReview: product.isFullReview || false,

        originalPrice: originalPrice.toString(),
        discountPrice: discountPrice.toString(),
        discountPercentage: discountPercentage.toString(),

        // Custom Rating
        customRating: product.customRating?.rating?.toString() || "",
        reviewCount: product.customRating?.reviewCount?.toString() || "",

        // Images - PROPERLY HANDLED
        subImages: subImages,

        // Features & Content
        features: product.features?.feature || [],
        colors: product.colors || [],
        styles: product.styles || [],
        specifications: product.specifications || [],
        customReviews: product.customReviews || [],

        // SEO
        seoTitle: product.seo?.title || "",
        seoDescription: product.seo?.description || "",
        seoKeywords: product.seo?.keywords?.join(", ") || "",

        // Description
        descriptionTitle: product.descriptionTitle || "",
        introduction: product.introduction || "",
        anchorTags: product.anchorTags || [],

        // Factors
        factorsToConsider: product.factorsToConsider || [],
        mostImportantFactorsHeading:
          product.mostImportantFactors?.heading || "",
        mostImportantFactorsText: product.mostImportantFactors?.text || "",

        // Common Questions
        commonQuestions: product.commonQuestions || [],

        // Conclusion
        conclusionHeading: product.conclusion?.heading || "",
        conclusionText: product.conclusion?.text || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle category changes specially to reset dependent dropdowns
    if (name === "mainCategory") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subCategory: "",
        subSubCategory: "",
      }));
    } else if (name === "subCategory") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subSubCategory: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePriceChange = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };

    // Calculate discount percentage when both prices are available
    if (newFormData.originalPrice && newFormData.discountPrice) {
      const original = parseFloat(newFormData.originalPrice);
      const discount = parseFloat(newFormData.discountPrice);

      if (original > 0 && discount < original) {
        const discountPercentage = Math.round(
          ((original - discount) / original) * 100
        );
        newFormData.discountPercentage = discountPercentage.toString();
      } else {
        newFormData.discountPercentage = "0";
      }
    } else {
      newFormData.discountPercentage = "0";
    }

    setFormData(newFormData);
  };

  // Enhanced Image Handlers
  const addSubImage = () => {
    if (newSubImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        subImages: [...prev.subImages, newSubImage.trim()],
      }));
      setNewSubImage("");
    }
  };

  const removeSubImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      subImages: prev.subImages.filter((_, i) => i !== index),
    }));
  };
  const updateSubImage = (index, newUrl) => {
    setFormData((prev) => ({
      ...prev,
      subImages: prev.subImages.map((url, i) => (i === index ? newUrl : url)),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addColor = () => {
    if (newColor.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
      setNewColor("");
    }
  };

  const removeColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const addStyle = () => {
    if (newStyle.trim()) {
      setFormData((prev) => ({
        ...prev,
        styles: [...prev.styles, newStyle.trim()],
      }));
      setNewStyle("");
    }
  };

  const removeStyle = (index) => {
    setFormData((prev) => ({
      ...prev,
      styles: prev.styles.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: [
          ...prev.specifications,
          {
            key: newSpecKey.trim(),
            value: newSpecValue.trim(),
          },
        ],
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const addAnchorTag = () => {
    if (newAnchorTag.word.trim() && newAnchorTag.link.trim()) {
      setFormData((prev) => ({
        ...prev,
        anchorTags: [...prev.anchorTags, { ...newAnchorTag }],
      }));
      setNewAnchorTag({
        word: "",
        link: "",
        isExternal: false,
      });
    }
  };

  const addFactor = () => {
    if (newFactor.trim()) {
      setFormData((prev) => ({
        ...prev,
        factorsToConsider: [...prev.factorsToConsider, newFactor.trim()],
      }));
      setNewFactor("");
    }
  };

  const removeFactor = (index) => {
    setFormData((prev) => ({
      ...prev,
      factorsToConsider: prev.factorsToConsider.filter((_, i) => i !== index),
    }));
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData((prev) => ({
        ...prev,
        commonQuestions: [
          ...prev.commonQuestions,
          {
            question: newQuestion.trim(),
            answer: "",
          },
        ],
      }));
      setNewQuestion("");
    }
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      commonQuestions: prev.commonQuestions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      commonQuestions: prev.commonQuestions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const addReview = () => {
    if (newReview.author.trim() && newReview.content.trim()) {
      setFormData((prev) => ({
        ...prev,
        customReviews: [
          ...prev.customReviews,
          {
            ...newReview,
            rating: parseFloat(newReview.rating) || 0,
            date: new Date(),
          },
        ],
      }));
      setNewReview({
        author: "",
        rating: "",
        title: "",
        content: "",
      });
    }
  };

  const removeReview = (index) => {
    setFormData((prev) => ({
      ...prev,
      customReviews: prev.customReviews.filter((_, i) => i !== index),
    }));
  };

  // CategoryEditItem component for editing categories
  function CategoryEditItem({ type, name, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);

    const handleSave = () => {
      if (editName.trim() && editName.trim() !== name) {
        onEdit(name, editName.trim());
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditName(name);
      setIsEditing(false);
    };

    return (
      <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ×
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {type === "main" ? "M" : type === "sub" ? "S" : "SS"}
              </span>
              <span className="text-sm text-gray-700">{name}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={onDelete}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🔄 FORM DATA anchorTags:", formData.anchorTags);
    console.log("🔄 FORM DATA all fields:", formData);

    // Calculate discount percentage properly
    let discountPercentage = parseFloat(formData.discountPercentage) || 0;
    if (
      !discountPercentage &&
      formData.originalPrice &&
      formData.discountPrice
    ) {
      const original = parseFloat(formData.originalPrice);
      const discount = parseFloat(formData.discountPrice);
      if (original > 0 && discount < original) {
        discountPercentage = Math.round(
          ((original - discount) / original) * 100
        );
      }
    }

    const images = [];

    // Add main image
    if (formData.mainImage) {
      images.push({
        url: formData.mainImage,
        variant: "MAIN",
      });
    }

    // Add sub-images
    formData.subImages.forEach((url) => {
      if (url.trim()) {
        images.push({
          url: url.trim(),
          variant: "SUB",
        });
      }
    });

    const updatedProduct = {
      ...product,
      // Basic Information
      title: formData.title,
      brand: formData.brand,
      labels: formData.labels,
      mainCategory: formData.mainCategory,
      subCategory: formData.subCategory,
      subSubCategory: formData.subSubCategory,
      affiliateUrl: formData.affiliateUrl,
      isFeatured: formData.isFeatured,
      isFullReview: formData.isFullReview,
      anchorTags: formData.anchorTags || [],

      // ✅ CORRECTED PRICING STRUCTURE
      price: {
        amount: parseFloat(formData.discountPrice) || 0,
        currency: "USD",
        displayAmount: `$${(parseFloat(formData.discountPrice) || 0).toFixed(
          2
        )}`,
      },
      listPrice: {
        amount: parseFloat(formData.originalPrice) || 0,
        currency: "USD",
        displayAmount: `$${(parseFloat(formData.originalPrice) || 0).toFixed(
          2
        )}`,
      },
      discount: {
        amount:
          parseFloat(formData.originalPrice) -
            parseFloat(formData.discountPrice) || 0,
        currency: "USD",
        displayAmount: `-${discountPercentage}%`,
        percentage: discountPercentage,
      },

      // Custom Rating
      customRating: {
        rating: parseFloat(formData.customRating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
      },

      // Images
      images: images,

      // Features & Content
      features: { feature: formData.features },
      colors: formData.colors,
      styles: formData.styles,
      specifications: formData.specifications,
      customReviews: formData.customReviews,

      // SEO
      seo: {
        title: formData.seoTitle,
        description: formData.seoDescription,
        keywords: formData.seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
      },

      // Description
      descriptionTitle: formData.descriptionTitle,
      introduction: formData.introduction,
      description: formData.introduction, // Fallback

      // Factors
      factorsToConsider: formData.factorsToConsider,
      mostImportantFactors: {
        heading: formData.mostImportantFactorsHeading,
        text: formData.mostImportantFactorsText,
      },

      // Common Questions
      commonQuestions: formData.commonQuestions,

      // Conclusion
      conclusion: {
        heading: formData.conclusionHeading,
        text: formData.conclusionText,
      },
    };

    console.log("🚀 FINAL DATA being sent to backend:", updatedProduct);
    console.log("🚀 Does it have anchorTags?", updatedProduct.anchorTags);
    onSave(updatedProduct);
  };

  if (!product) return null;

  console.log("form data", formData);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Update Product
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg">
                ASIN: {product.asin}
              </span>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
        </div>
      </div>
      description: formData.introduction,
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* UPDATED CATEGORY DROPDOWNS */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Main Category
                  </label>
                  <select
                    name="mainCategory"
                    value={formData.mainCategory}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Main Category</option>
                    {getMainCategories().map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Sub Category
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    disabled={!formData.mainCategory}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Sub Category</option>
                    {getSubCategories(formData.mainCategory).map(
                      (subCategory) => (
                        <option key={subCategory._id} value={subCategory._id}>
                          {subCategory.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Sub-Sub Category
                  </label>
                  <select
                    name="subSubCategory"
                    value={formData.subSubCategory}
                    onChange={handleChange}
                    disabled={!formData.subCategory}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Sub-Sub Category</option>
                    {getSubSubCategories(
                      formData.mainCategory,
                      formData.subCategory
                    ).map((subSubCategory) => (
                      <option
                        key={subSubCategory._id}
                        value={subSubCategory._id}
                      >
                        {subSubCategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-800">
                  Featured Product
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFullReview"
                  checked={formData.isFullReview}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-800">
                  Full Detailed Review
                </label>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Labels
              </label>
              <select
                multiple
                value={formData.labels || []}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFormData((prev) => ({ ...prev, labels: selected }));
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
              >
                <option value="best seller">Best Seller</option>
                <option value="trending">Trending</option>
                <option value="new">New Arrival</option>
                <option value="featured">Featured</option>
                <option value="hot">Hot</option>
                <option value="amazon-choice">Amazon's choice</option>
                <option value="popular">Popular</option>
                <option value="top-pick">Top Picks</option>
              </select>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Main Image
                </h3>
                {formData.mainImage ? (
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <img
                      src={formData.mainImage}
                      alt="Main product"
                      className="w-24 h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Primary product image from Amazon
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {formData.mainImage}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                    <p className="text-gray-500">No main image available</p>
                  </div>
                )}
              </div>

              {userRole === "admin" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Affiliate Link
                  </label>
                  <input
                    onClick={() => onEdit(formData.affiliateUrl)}
                    type="url"
                    name="affiliateUrl"
                    value={formData.affiliateUrl}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://amazon.com/dp/ASIN"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Pricing Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pricing Information
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={(e) =>
                  handlePriceChange("originalPrice", e.target.value)
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Discount Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={(e) =>
                  handlePriceChange("discountPrice", e.target.value)
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Discount Percentage
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                readOnly
                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                placeholder="0%"
              />
              <p className="text-xs text-gray-500 mt-1">
                Calculated automatically
              </p>
            </div>
          </div>
        </div>

        {/* Custom Rating */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Custom Rating
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Rating (0-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="customRating"
                value={formData.customRating}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Review Count
              </label>
              <input
                type="number"
                name="reviewCount"
                value={formData.reviewCount}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sub Images */}
        <div className="space-y-4">
          {" "}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Sub Images from Amazon ({formData.subImages.length})
            </h3>

            {formData.subImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.subImages.map((url, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col space-y-3">
                      <img
                        src={url}
                        alt={`Sub image ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSubImage(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded text-xs flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  No sub-images available from Amazon
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Amazon PAAPI didn't return additional product images
                </p>
              </div>
            )}
          </div>
          {/* Add Custom Sub Images */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Add Custom Sub Images
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Manually add more images)
              </span>
            </h3>

            <div className="flex space-x-3">
              <input
                type="url"
                value={newSubImage}
                onChange={(e) => setNewSubImage(e.target.value)}
                placeholder="https://example.com/additional-image.jpg"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addSubImage}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Custom Image
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Add additional product images that weren't included in Amazon's
              data
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Features</h2>

          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="flex-1 p-3 border border-gray-300 rounded-lg bg-white">
                  {feature}
                </span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div className="flex space-x-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter feature"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Feature
              </button>
            </div>
          </div>
        </div>

        {/* Colors & Styles */}
        <div className="grid grid-cols-2 gap-8">
          {/* Colors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Colors</h2>

            <div className="space-y-3">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="flex-1 p-3 border border-gray-300 rounded-lg bg-white">
                    {color}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Enter color"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Color
                </button>
              </div>
            </div>
          </div>

          {/* Styles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Styles</h2>

            <div className="space-y-3">
              {formData.styles.map((style, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="flex-1 p-3 border border-gray-300 rounded-lg bg-white">
                    {style}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStyle(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value)}
                  placeholder="Enter style"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addStyle}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Style
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Specifications
          </h2>

          <div className="space-y-4">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={spec.key}
                  readOnly
                  className="w-1/3 p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <input
                  type="text"
                  value={spec.value}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div className="flex space-x-3">
              <input
                type="text"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Key"
                className="w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Value"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Anchor Tags Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Anchor Tags</h2>

          <div className="space-y-4">
            {formData.anchorTags?.map((anchor, index) => (
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
                      setFormData((prev) => ({
                        ...prev,
                        anchorTags:
                          prev.anchorTags?.filter((_, i) => i !== index) || [],
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
            {formData.anchorTags?.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    Total anchor tags:{" "}
                    <strong>{formData.anchorTags.length}</strong>
                  </span>
                  <span className="text-sm text-blue-800">
                    External:{" "}
                    <strong>
                      {formData.anchorTags.filter((a) => a.isExternal).length}
                    </strong>{" "}
                    | Internal:{" "}
                    <strong>
                      {formData.anchorTags.filter((a) => !a.isExternal).length}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            SEO Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO title for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                SEO Description
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows={3}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO description for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                SEO Keywords
              </label>
              <input
                type="text"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Comma-separated keywords"
              />
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Product Description
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Description Title *
              </label>
              <input
                type="text"
                name="descriptionTitle"
                value={formData.descriptionTitle}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Introduction *
              </label>
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Factors to Consider */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Factors to Consider
          </h2>

          <div className="space-y-4">
            {formData.factorsToConsider.map((factor, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="flex-1 p-3 border border-gray-300 rounded-lg bg-white">
                  {factor}
                </span>
                <button
                  type="button"
                  onClick={() => removeFactor(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div className="flex space-x-3">
              <input
                type="text"
                value={newFactor}
                onChange={(e) => setNewFactor(e.target.value)}
                placeholder="Enter factor"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addFactor}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Factor
              </button>
            </div>
          </div>
        </div>

        {/* Most Important Factors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Most Important Factors
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Heading
              </label>
              <input
                type="text"
                name="mostImportantFactorsHeading"
                value={formData.mostImportantFactorsHeading}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="The Most Important Factors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Text
              </label>
              <textarea
                name="mostImportantFactorsText"
                value={formData.mostImportantFactorsText}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Common Questions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Common Questions
          </h2>

          <div className="space-y-6">
            {formData.commonQuestions.map((question, index) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(index, "question", e.target.value)
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Question"
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea
                  value={question.answer}
                  onChange={(e) =>
                    updateQuestion(index, "answer", e.target.value)
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Answer"
                />
              </div>
            ))}

            <div className="flex space-x-3">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter question"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Question
              </button>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Conclusion</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Heading
              </label>
              <input
                type="text"
                name="conclusionHeading"
                value={formData.conclusionHeading}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Conclusion"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Conclusion Text *
              </label>
              <textarea
                name="conclusionText"
                value={formData.conclusionText}
                onChange={handleChange}
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Custom Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Custom Reviews
          </h2>

          <div className="space-y-6">
            {formData.customReviews.map((review, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={review.author}
                    readOnly
                    className="p-2 border border-gray-300 rounded bg-gray-50"
                    placeholder="Author"
                  />
                  <input
                    type="number"
                    value={review.rating}
                    readOnly
                    className="p-2 border border-gray-300 rounded bg-gray-50"
                    placeholder="Rating"
                  />
                </div>
                <input
                  type="text"
                  value={review.title}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  placeholder="Review Title"
                />
                <textarea
                  value={review.content}
                  readOnly
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  placeholder="Review Content"
                />
                <button
                  type="button"
                  onClick={() => removeReview(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Add Review Form */}
            <div className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newReview.author}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Author"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }))
                  }
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rating (0-5)"
                />
              </div>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Review Title"
              />
              <textarea
                value={newReview.content}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Review Content"
              />
              <button
                type="button"
                onClick={addReview}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Review
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
