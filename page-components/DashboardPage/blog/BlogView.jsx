import api from "@/lib/api/axios";

export default async function BlogView({ params }) {
  const { slug } = params;

  const res = await api.get(`/blog/${slug}`);
  const blog = res.data.data;

  if (!blog) {
    return <h1 className="text-center mt-10 text-red-600">Blog Not Found</h1>;
  }
  console.log("blog page is :",blog);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{blog.title}</h1>

      {/* Handle author format difference */}
      <p className="text-gray-500 mb-3">
        By {blog.authorName || blog.author?.name || "Unknown"}
      </p>

      {/* Handle cover image difference */}
      {blog.coverImage || blog.featuredImage?.url ? (
        <img
          src={blog.coverImage || blog.featuredImage?.url}
          className="w-full rounded mb-5"
          alt="Cover"
        />
      ) : null}

      {/* Handle content array or string */}
      <div className="prose mb-4">
        {Array.isArray(blog.content)
          ? blog.content.map((c, i) => (
              <p key={i}>{c?.data?.text?.[0]?.value || ""}</p>
            ))
          : <p>{blog.content}</p>
        }
      </div>

      {/* Handle steps gracefully */}
      {blog.steps?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6">Steps</h2>
          {blog.steps.map((s, i) => (
            <div key={i} className="border p-3 rounded my-2">
              <h4 className="font-medium">{s.title}</h4>
              <p>{s.description}</p>
              {s.image && <img src={s.image} className="w-full rounded mt-2" />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
