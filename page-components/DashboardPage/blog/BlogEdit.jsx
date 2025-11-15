export default function RedirectEdit({ params }) {
  if (typeof window !== "undefined") {
    window.location.href = `/blog?edit=${params.slug}`;
  }
  return null;
}
