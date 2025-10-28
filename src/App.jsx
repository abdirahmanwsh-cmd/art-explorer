import { useEffect, useState } from "react";
import Header from "./components/Header";
import Row from "./components/Row";
import { metSearchIDs, metGetObjects } from "./lib/met";
import { aicSearch } from "./lib/aic";
import "./index.css";
import Favorites from "./components/favorites.jsx";
import Details from "./components/details.jsx";
import Cart from "./components/cart.jsx";
import Checkout from "./components/checkout.jsx";
import { countItems, clearCart } from "./lib/cart";
import { useAuth } from "./auth";

// Component
function App() {
  const { user, loginWithGoogle } = useAuth();

  // Default rows
  const [metItems, setMetItems] = useState([]);
  const [aicItems, setAicItems] = useState([]);

  // NEW rows
  const [modernItems, setModernItems] = useState([]);
  const [renaissanceItems, setRenaissanceItems] = useState([]);
  const [streetItems, setStreetItems] = useState([]);
  const [surrealItems, setSurrealItems] = useState([]);

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Views: home | favorites | details | checkout
  const [view, setView] = useState("home");

  // Details selection
  const [selection, setSelection] = useState(null); // { id, source }

  // Cart UI
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(countItems());

  // Helper: fetch a mixed row from both APIs, tagged with source
  async function fetchMixedRow(term, take = 12) {
    const [metIDs, aic] = await Promise.all([metSearchIDs(term), aicSearch(term, take)]);
    const met = await metGetObjects(metIDs, take);
    const metTagged = met.map((x) => ({ ...x, __source: "met" }));
    const aicTagged = aic.map((x) => ({ ...x, __source: "aic" }));
    return [...metTagged, ...aicTagged].slice(0, take);
  }

  // Load rows on mount
  useEffect(() => {
    async function loadDefaults() {
      try {
        // Keep your two originals
        const ids = await metSearchIDs("impressionism");
        const met = await metGetObjects(ids, 12);
        const aic = await aicSearch("photography", 12);
        setMetItems(met);
        setAicItems(aic);

        // New four
        const [modern, rena, street, surreal] = await Promise.all([
          fetchMixedRow("abstract modern", 12),          // Modern & Abstract
          fetchMixedRow("renaissance classical", 12),    // Renaissance & Classical
          fetchMixedRow("street urban", 12),             // Street & Urban
          fetchMixedRow("surrealism fantasy", 12),       // Surrealism & Fantasy
        ]);
        setModernItems(modern);
        setRenaissanceItems(rena);
        setStreetItems(street);
        setSurrealItems(surreal);
      } catch (e) {
        console.error("Default load failed", e);
      }
    }
    loadDefaults();
  }, []);

  // Search handler
  async function handleSearch(term) {
    const raw = (typeof term === "string" ? term : searchValue) || "";
    const q = raw.trim();
    if (!q) return;

    setQuery(q);
    setLoading(true);
    setResults([]);

    try {
      const [metIDs, aic] = await Promise.all([metSearchIDs(q), aicSearch(q, 12)]);
      const met = await metGetObjects(metIDs, 12);
      const metTagged = met.map((it) => ({ ...it, __source: "met" }));
      const aicTagged = aic.map((it) => ({ ...it, __source: "aic" }));
      setResults([...metTagged, ...aicTagged]);
    } catch (e) {
      console.error("Search failed", e);
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

  // Checkout flow: close cart, clear cart, show success page
  function handleCheckout() {
    setCartOpen(false);
    clearCart();
    setTimeout(() => {
      setView("checkout");
      setCartCount(countItems());
    }, 150); // small delay so drawer can close smoothly
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header view={view} setView={setView} canDetails={!!selection} />

      {/* Floating cart button */}
      <button
        onClick={() => (user ? setCartOpen(true) : loginWithGoogle())}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 rounded-full bg-neutral-100 text-neutral-900 px-4 py-2 font-medium shadow"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
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
        ) : view === "checkout" ? (
          <Checkout onContinue={() => setView("home")} />
        ) : (
          <>
            {/* Search Bar */}
            <div className="flex gap-2 my-5 px-0">
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
            {!loading && results.length > 0 && (
              <Row
                title={`Search Results for "${query}"`}
                items={results}
                source="met"
                onOpen={openDetails}
              />
            )}

            {/* Final Six Rows */}
            <Row title="Impressionism (The Met)" items={metItems} source="met" onOpen={openDetails} />
            <Row title="Photography (AIC)" items={aicItems} source="aic" onOpen={openDetails} />
            <Row title="Modern & Abstract" items={modernItems} source="met" onOpen={openDetails} />
            <Row title="Renaissance & Classical" items={renaissanceItems} source="met" onOpen={openDetails} />
            <Row title="Street & Urban" items={streetItems} source="met" onOpen={openDetails} />
            <Row title="Surrealism & Fantasy" items={surrealItems} source="met" onOpen={openDetails} />
          </>
        )}
      </main>

      {/* Cart drawer */}
      <Cart
        open={cartOpen}
        onClose={() => { setCartOpen(false); setCartCount(countItems()); }}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;