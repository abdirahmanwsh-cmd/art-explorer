const BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

/** Search for object IDs that match a keyword */
  async function metSearchIDs(query) {
  const url =  `${BASE}/search?hasImages=true&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Met search failed");
  const data = await res.json();
  return data.objectIDs ? data.objectIDs.slice(0, 20) : [];
}

/** Fetch object details for an array of IDs (limit optional) */
  async function metGetObjects(ids = [], limit = 12) {
  const slice = ids.slice(0, limit);
  const promises = slice.map(async (id) => {
    const res = await fetch(`${BASE}/objects/${id}`);
    if (!res.ok) return null;
    const d = await res.json();
    if (!d.primaryImageSmall) return null;
    return {
      id: String(d.objectID),
      title: d.title || "Untitled",
      artist: d.artistDisplayName || "Unknown",
      image: d.primaryImageSmall,
      source: "met",
    };
  });
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}
export { metSearchIDs, metGetObjects };