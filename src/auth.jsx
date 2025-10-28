import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth, provider } from "./firebaseconfig";

// Context
const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

// Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
    const off = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => off();
  }, []);

  async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e?.code === "auth/popup-blocked" || e?.code === "auth/popup-closed-by-user") {
        try { await signInWithRedirect(auth, provider); } catch (e2) { alert(e2.code + ": " + e2.message); }
      } else {
        alert(e.code + ": " + e.message);
      }
    }
  }

  async function logout() {
    try { await signOut(auth); } catch (e) { alert(e.code + ": " + e.message); }
  }

  const value = useMemo(() => ({ user, loading, loginWithGoogle, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
function useAuth() { return useContext(AuthContext); }

// Exports
export { AuthProvider, useAuth };