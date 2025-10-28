import { db } from "../firebaseconfig";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

// Build a unique favorite document ID using museum source and artwork ID
const favDocId = (source, id) => `${source}_${String(id)}`;

// Toggle favorite on/off for a given user and artwork
async function toggleFavorite(uid, art) {
  const id = favDocId(art.source, art.id);
  const ref = doc(db, "users", uid, "favorites", id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await deleteDoc(ref);
    return { removed: true };
  } else {
    await setDoc(ref, { ...art, addedAt: serverTimestamp() }, { merge: true });
    return { added: true };
  }
}

// Watch a single artwork’s favorite status in real time
function watchFavorite(uid, art, callback) {
  const id = favDocId(art.source, art.id);
  const ref = doc(db, "users", uid, "favorites", id);
  return onSnapshot(ref, (snap) => callback(snap.exists()));
}

// Exports
export { favDocId, toggleFavorite, watchFavorite };