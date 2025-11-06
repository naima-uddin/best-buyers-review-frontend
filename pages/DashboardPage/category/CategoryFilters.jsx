"use client";
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

  return (
    <div className="flex gap-3 mb-4 justify-center">
      {/* MAIN CATEGORY */}
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
        {categories
          .filter((c) => c.level === 1)
          .map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>

      {/* SUB CATEGORY */}
      <select
        value={selectedSub}
        onChange={(e) => {
          setSelectedSub(e.target.value);
          setPage(1);
        }}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Sub Categories</option>
        {categories
          .filter((c) => c.parent === selectedMain)
          .map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>
    </div>
  );
}
