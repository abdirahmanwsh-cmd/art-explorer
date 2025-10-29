import { useEffect, useMemo, useState } from "react";
import FavoriteButton from "./FavoriteButton";
import { addToCart } from "../lib/cart";
import { useAuth } from "../auth";


function aicImageUrl(image_id) {
  return image_id ?`https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`: "";
}


function Details({ selection, onBack, onCartChange }) {
  const { user, loginWithGoogle } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  
  if (!user) {
    return (
      <div className="px-4 py-8">
        <button
          onClick={loginWithGoogle}
          className="rounded-lg border border-neutral-700 px-3 py-2 hover:bg-neutral-800"
        >
          Sign in to view details
        </button>
      </div>
    );
  }

  const id = selection?.id;
  const source = selection?.source;

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!id || !source) return;
      setLoading(true);
      try {
        if (source === "met") {
          const r = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
          const d = await r.json();
          if (!cancelled) {
            setData({
              source: "met",
              id: String(d.objectID),
              title: d.title || "Untitled",
              artist: d.artistDisplayName || "",
              date: d.objectDate || "",
              medium: d.medium || "",
              department: d.department || "",
              dimensions: d.dimensions || "",
              creditLine: d.creditLine || "",
              imageUrl: d.primaryImage || d.primaryImageSmall || "",
              museumUrl: d.objectURL || "",
            });
          }
        } else {
          const r = await fetch(`https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,artist_title,date_display,medium_display,department_title,dimensions,credit_line,image_id`);
          const { data: d } = await r.json();
          if (!cancelled) {
            setData({
              source: "aic",
              id: String(d.id),
              title: d.title || "Untitled",
              artist: d.artist_title || "",
              date: d.date_display || "",
              medium: d.medium_display || "",
              department: d.department_title || "",
              dimensions: d.dimensions || "",
              creditLine: d.credit_line || "",
              imageUrl: aicImageUrl(d.image_id),
              museumUrl: `https://www.artic.edu/artworks/${d.id}`,
            });
          }
        }
      } catch (e) {
        if (!cancelled) setData(null);
        console.error("Details fetch failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id, source]);

  const price = useMemo(() => {
    const num = Number(String(id || "").replace(/\D/g, "").slice(-3) || 42);
    return 20 + (num % 80);
  }, [id]);

  if (!id || !source) {
    return <div className="px-4 py-8 text-neutral-400">No artwork selected.</div>;
  }

  if (loading)
    return <div className="px-4 py-8 text-neutral-400">Loading details…</div>;
  if (!data)
    return (
      <div className="px-4 py-8 text-neutral-400">Couldn’t load this artwork.</div>
    );

  const artForFav = {
    id: data.id,
    source: data.source,
    title: data.title,
    artist: data.artist,
    imageUrl: data.imageUrl,
  };

  function handleAddToCart() {
    addToCart({
      id: data.id,
      source: data.source,
      title: data.title,
      imageUrl: data.imageUrl,
      price,
      qty: 1,
    });
    onCartChange && onCartChange();
  }

  return (
   
    <section className="my-6 overflow-y-auto max-h-[90vh]">
      <div className="flex items-center px-4 gap-2">
        <button
          onClick={onBack}
          className="rounded-lg border border-neutral-700 px-3 py-2 hover:bg-neutral-800"
        >
          ← Back
        </button>
        <h2 className="ml-2 text-lg font-semibold text-neutral-100">
          {data.title}
        </h2>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4 px-4">
        <div className="rounded-xl overflow-hidden border border-neutral-800">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.title}
              className="w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="p-6 text-neutral-400">No image available</div>
          )}
        </div>

        <div className="text-sm leading-relaxed">
          <div className="text-neutral-300 space-y-2">
            {data.artist && (
              <div>
                <span className="opacity-70">Artist:</span> {data.artist}
              </div>
            )}
            {data.date && (
              <div>
                <span className="opacity-70">Date:</span> {data.date}
              </div>
            )}
            {data.medium && (
              <div>
                <span className="opacity-70">Medium:</span> {data.medium}
              </div>
            )}
            {data.department && (
              <div>
                <span className="opacity-70">Department:</span> {data.department}
              </div>
            )}
            {data.dimensions && (
              <div>
                <span className="opacity-70">Dimensions:</span> {data.dimensions}
              </div>
            )}
            {data.creditLine && (
              <div>
                <span className="opacity-70">Credit line:</span>{" "}
                {data.creditLine}
              </div>
            )}
            {data.museumUrl && (
              <div className="pt-2">
                <a
                  className="underline text-neutral-200 hover:text-white"
                  href={data.museumUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on {data.source === "met" ? "The Met" : "AIC"} website →
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <FavoriteButton art={artForFav} />
            <button
              onClick={handleAddToCart}
              className="rounded-lg bg-neutral-100 text-neutral-900 px-4 py-2 font-medium hover:bg-white"
            >
              Add to cart · ${price}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Export
export default Details;