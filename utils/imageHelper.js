export const getImageUrl = (path) => {
  if (!path) return "/no-image.png"; // fallback image if missing
  const base = process.env.NEXT_PUBLIC_IMAGE_API_URL?.replace(/\/$/, "");
  return `${base}${path}`;
};
