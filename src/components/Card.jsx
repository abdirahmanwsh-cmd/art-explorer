import { useAuth } from "../auth";
import FavoriteButton from "./FavoriteButton";

const BLANK =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

function Card({ item, source, onOpen }) {
  const { user, loginWithGoogle } = useAuth();

  const imageSrc =
    item?.image ||
    item?.primaryImageSmall ||
    item?.image_url ||
    item?.thumbnail?.lqip ||
    BLANK;

  const title = item?.title ?? item?.data?.title ?? "Untitled";
  const artist =
    item?.artistDisplayName ?? item?.artist_title ?? item?.artist ?? "";
  const objectId =
    item?.objectID ?? item?.id ?? item?.artwork_id ?? item?.objectId;

  const art = {
    id: String(objectId),
    source,
    title,
    artist,
    imageUrl: imageSrc,
  };

  function handleOpen(e) {
    e.preventDefault?.();
    if (!user) return loginWithGoogle();
    onOpen && onOpen({ item, source });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === "Enter" && handleOpen(e)}
      
      className="group shrink-0 rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden
                 w-[86vw] xs:w-[74vw] sm:w-56 hover:border-neutral-700 hover:shadow-xl transition-all duration-300"
      title={title}
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
          decoding="async"
          width="340"
          height="452"
          onError={(e) => { e.currentTarget.src = BLANK; }}
        />

        
        <div
          className="absolute top-2 right-2"
          onClick={(e) => { e.stopPropagation(); e.preventDefault?.(); }}
        >
          <FavoriteButton art={art} className="px-2.5 py-1.5 rounded-full text-base bg-black/55 backdrop-blur border border-white/20" />
        </div>

        
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <div className="rounded-xl bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2.5">
            <div className="text-[13px] font-semibold text-white leading-tight line-clamp-2">
              {title}
            </div>
            {artist ? (
              <div className="text-[12px] text-neutral-300 line-clamp-1">{artist}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;