const BASE = "https://api.artic.edu/api/v1";

/** Search AIC artworks by keyword */
  async function aicSearch(query, limit = 12) {
  const url = `${BASE}/artworks/search?q=${encodeURIComponent(
    query
  )}&limit=${limit}&fields=id,title,artist_title,image_id`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("AIC search failed");
  const data = await res.json();
  const baseImg = "https://www.artic.edu/iiif/2";

  return (data.data || [])
    .filter((x) => x.image_id)
    .map((x) => ({
      id: String(x.id),
      title: x.title || "Untitled",
      artist: x.artist_title || "Unknown",
      image: `${baseImg}/${x.image_id}/full/843,/0/default.jpg`,
      source: "aic",
    }));
}
export { aicSearch };