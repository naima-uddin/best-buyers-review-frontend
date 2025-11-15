import api from "@/lib/api/axios";

export default async function BlogView({ params }) {
  const res = await api.get(`/blog/${params.slug}`);
  const blog = res.data.data;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="text-gray-500 mb-3">By {blog.authorName}</p>
      <img src={blog.coverImage} className="w-full rounded mb-5" />

      <p className="mb-4">{blog.content}</p>

      <h2 className="text-xl font-semibold mt-6">Steps</h2>
      {blog.steps.map((s, i) => (
        <div key={i} className="border p-3 rounded my-2">
          <h4 className="font-medium">{s.title}</h4>
          <p>{s.description}</p>
          {s.image && <img src={s.image} className="w-full rounded mt-2" />}
        </div>
      ))}
    </div>
  );
}
