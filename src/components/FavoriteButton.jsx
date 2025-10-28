import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import { toggleFavorite, watchFavorite } from "../lib/favorites";

// Component
function FavoriteButton({ art, className }) {
  const [user, setUser] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => setUser(u));
    return () => off();
  }, []);

  useEffect(() => {
    if (!user) { setIsFav(false); return; }
    const off = watchFavorite(user.uid, art, setIsFav);
    return () => off && off();
  }, [user, art]);

  async function handleClick(e) {
    // very important: never bubble to Card's onClick
    e.stopPropagation();
    try {
      setBusy(true);
      if (!user) {
        await signInWithPopup(auth, provider);
        return;
      }
      await toggleFavorite(user.uid, art);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-pressed={isFav}
      title={!user ? "Sign in to save" : isFav ? "Remove from favorites" : "Save to favorites"}
      className={
        className ||
        "px-2 py-1 rounded-full border border-neutral-700 text-sm bg-neutral-900 hover:bg-neutral-800"
      }
    >
      {isFav ? "♥" : "♡"}
    </button>
  );
}

// Export
export default FavoriteButton;