import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebaseconfig";
import Row from "./Row";

// Component
function Favorites() {
  const [user, setUser] = useState(null);
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => off();
  }, []);

  useEffect(() => {
    if (!user) { setFavs([]); setLoading(false); return; }
    setLoading(true);
    const q = query(collection(db, "users", user.uid, "favorites"), orderBy("addedAt", "desc"));
    const off = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => {
        const x = d.data();
        return {
          id: x.id,
          title: x.title,
          artist: x.artist,
          image: x.imageUrl,
          objectID: x.id,
          artwork_id: x.id,
          objectId: x.id,
          __source: x.source || "met",
        };
      });
      setFavs(items);
      setLoading(false);
    }, () => setLoading(false));
    return () => off();
  }, [user]);

  if (!user) return <div className="px-4 py-8 text-neutral-300">Please sign in to see your Favorites.</div>;
  if (loading) return <div className="px-4 py-8 text-neutral-400">Loading favorites…</div>;
  if (!favs.length) return <div className="px-4 py-8 text-neutral-300">No favorites yet.</div>;

  return (
    <section className="my-6">
      <h2 className="text-lg font-semibold text-neutral-100 px-4">Favorites</h2>
      <Row title="" items={favs} source="met" />
    </section>
  );
}

// Export
export default Favorites;