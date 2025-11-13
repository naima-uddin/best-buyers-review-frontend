"use client";

// Helper function to flatten nested category tree
const flattenCategories = (categories) => {
  const result = [];

  const traverse = (cats) => {
    cats.forEach((cat) => {
      // Add current category
      result.push(cat);

      // Recursively add children
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children);
      }
    });
  };

  traverse(categories);
  return result;
};

export default function CategoryFilters({
  categories,
  selectedMain,
  setSelectedMain,
  selectedSub,
  setSelectedSub,
  setPage,
}) {
  if (!categories || categories.length === 0) {
    return <p>Loading categories...</p>;
  }

  // Flatten the nested tree structure into a flat array
  const flatCategories = flattenCategories(categories);

  console.log("Selected Main:", selectedMain);
  console.log("Flattened Categories:", flatCategories);

  return (
    <div className="flex gap-3 mb-4 justify-center">
      {/* MAIN CATEGORY (Level 1) */}
      <select
        value={selectedMain}
        onChange={(e) => {
          setSelectedMain(e.target.value);
          setSelectedSub("");
          setPage(1);
        }}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Main Categories</option>
        {flatCategories
          .filter((c) => c.level === 1)
          .map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>

      {/* SUB CATEGORY (Level 2 - children of selected main) */}
      <select
        value={selectedSub}
        onChange={(e) => {
          setSelectedSub(e.target.value);
          setPage(1);
        }}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        disabled={!selectedMain}
      >
        <option value="">All Sub Categories</option>
        {flatCategories
          .filter((c) => String(c.parent) === String(selectedMain))
          .map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>
    </div>
  );
}
