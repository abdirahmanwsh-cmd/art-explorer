const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

async function metSearchIDs(query) {
  try {
    const url = `${PROXY_URL}${BASE}/search?hasImages=true&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Met search failed: ${res.status}`);
    const data = await res.json();
    return data.objectIDs ? data.objectIDs.slice(0, 20) : [];
  } catch (error) {
    console.error('Met search error:', error);
    return [];
  }
}

async function metGetObjects(ids = [], limit = 12) {
  try {
    const slice = ids.slice(0, limit);
    const promises = slice.map(async (id) => {
      const res = await fetch(`${PROXY_URL}${BASE}/objects/${id}`);
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
  } catch (error) {
    console.error('Met objects error:', error);
    return [];
  }
}

export { metSearchIDs, metGetObjects };