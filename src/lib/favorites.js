import { db } from "../firebaseconfig";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";


const favDocId = (source, id) => `${source}_${String(id)}`;


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


function watchFavorite(uid, art, callback) {
  const id = favDocId(art.source, art.id);
  const ref = doc(db, "users", uid, "favorites", id);
  return onSnapshot(ref, (snap) => callback(snap.exists()));
}


export { favDocId, toggleFavorite, watchFavorite };