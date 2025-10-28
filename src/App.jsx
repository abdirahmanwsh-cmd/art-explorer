import { useEffect, useState } from "react";
import Header from "./components/Header";
import Row from "./components/Row";
import { metSearchIDs, metGetObjects } from "./lib/met";
import { aicSearch } from "./lib/aic";
import "./index.css";
import Favorites from "./components/favorites.jsx";
import Details from "./components/details.jsx";
import Cart from "./components/cart.jsx";
import { countItems } from "./lib/cart";
import { useAuth } from "./auth";

// Component
function App() {
  const { user, loginWithGoogle } = useAuth();

  // Default rows
  const [metItems, setMetItems] = useState([]);
  const [aicItems, setAicItems] = useState([]);

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");         // last submitted term
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // View
  const [view, setView] = useState("home"); // "home" | "favorites" | "details"

  // Details selection
  const [selection, setSelection] = useState(null); // { id, source }

  // Cart UI
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(countItems());

  // Load two default rows on mount
  useEffect(() => {
    async function loadDefaults() {
      try {
        const ids = await metSearchIDs("impressionism");
        const met = await metGetObjects(ids, 12);
        const aic = await aicSearch("photography", 12);
        setMetItems(met);
        setAicItems(aic);
      } catch (e) {
        console.error("Default load failed", e);
      }
    }
    loadDefaults();
  }, []);

  // Search handler (robust against accidental event argument)
  async function handleSearch(term) {
    const raw = (typeof term === "string" ? term : searchValue) || "";
    const q = raw.trim();
    if (!q) return;

    setQuery(q);
    setLoading(true);
    setNoResults(false);
    setResults([]);

    try {
      const [metIDs, aic] = await Promise.all([metSearchIDs(q), aicSearch(q, 12)]);
      const met = await metGetObjects(metIDs, 12);

      // tag true source so favorites work for both
      const metTagged = met.map((it) => ({ ...it, __source: "met" }));
      const aicTagged = aic.map((it) => ({ ...it, __source: "aic" }));
      const merged = [...metTagged, ...aicTagged];

      setResults(merged);
      if (merged.length === 0) setNoResults(true);
    } catch (e) {
      console.error("Search failed", e);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  }

  // Open details (auth-gated)
  function openDetails({ item, source }) {
    if (!user) { loginWithGoogle(); return; }
    const objectId = String(item?.objectID ?? item?.id ?? item?.artwork_id ?? item?.objectId);
    setSelection({ id: objectId, source: source || item?.__source || "met" });
    setView("details");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header view={view} setView={setView} canDetails={!!selection} />

      {/* Floating cart button (auth-gated) */}
      <button
  onClick={() => (user ? setCartOpen(true) : loginWithGoogle())}
  className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 rounded-full bg-neutral-100 text-neutral-900 px-4 py-2 font-medium shadow"
  style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}>
  Cart ({cartCount})
     </button>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        {view === "favorites" ? (
          <Favorites />
        ) : view === "details" ? (
          <Details
            selection={selection}
            onBack={() => setView("home")}
            onCartChange={() => setCartCount(countItems())}
          />
        ) : (
          <>
            {/* Search Bar */}
            <div className="flex gap-2 my-5 px-3 sm:px-4">
  <input
    type="search"
    value={searchValue}
    onChange={(e) => setSearchValue(e.currentTarget.value)}
    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
    placeholder="Search artworks, artists, or styles"
    className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm sm:text-base
               outline-none focus:ring-2 focus:ring-neutral-600 placeholder:text-neutral-500"
  />
  <button
    type="button"
    onClick={() => handleSearch()}
    className="rounded-xl bg-neutral-100 text-neutral-900 px-4 py-2.5 text-sm sm:text-base font-medium hover:bg-white
               border border-neutral-700/0"
  >
    Search
  </button>
</div>
            {/* Search Results */}
            {loading && (
              <div className="text-center text-neutral-400 py-10">Loading...</div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="text-center text-neutral-400 py-10">
                No results found for "{query}".
              </div>
            )}

            {!loading && results.length > 0 && (
              <Row
                title={`Search Results for "${query}"`}
                items={results}
                source="met"
                onOpen={openDetails}
              />
            )}

            {/* Default Rows */}
            <Row title="Impressionism (The Met)" items={metItems} source="met" onOpen={openDetails} />
            <Row title="Photography (AIC)" items={aicItems} source="aic" onOpen={openDetails} />
          </>
        )}
      </main>

      {/* Cart drawer (auth-gated in component as well) */}
      <Cart
        open={cartOpen}
        onClose={() => { setCartOpen(false); setCartCount(countItems()); }}
      />
    </div>
  );
}

// Export
export default App;