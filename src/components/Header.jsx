import { useAuth } from "../auth";

// Component
function Header({ view, setView, canDetails }) {
  const { user, loginWithGoogle, logout } = useAuth();

  const tabBase = "rounded-lg px-3 py-2 text-sm font-medium border border-neutral-800";
  const active = "bg-neutral-800 text-white";
  const inactive = "bg-neutral-900 text-neutral-300 hover:text-white";
  const disabled = "bg-neutral-900 text-neutral-600 cursor-not-allowed";

  function goHome() { setView("home"); }
  function goFav() { user ? setView("favorites") : loginWithGoogle(); }
  function goDetails() { (user && canDetails) ? setView("details") : loginWithGoogle(); }

  return (
    <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto flex items-center gap-3 px-4 sm:px-6 py-3">
        <div className="text-2xl font-semibold tracking-tight text-white">
          Art Explorer
        </div>

        <div className="ml-4 flex items-center gap-2">
          <button onClick={goHome} className={`${tabBase} ${view === "home" ? active : inactive}`}>Home</button>
          <button onClick={goFav} className={`${tabBase} ${view === "favorites" ? active : inactive}`}>
            Favorites
          </button>
          <button
            onClick={goDetails}
            className={`${tabBase} ${view === "details" ? active : (user && canDetails ? inactive : disabled)}`}
            disabled={!user || !canDetails}
            title={!user ? "Sign in to open details" : (!canDetails ? "Open an artwork first" : "Open details")}
          >
            Details
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <img
                src={user.photoURL || ""}
                alt="user"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-neutral-700"
              />
              <button
                onClick={logout}
                className="rounded-lg bg-neutral-900 px-3 py-2 font-medium hover:text-white text-neutral-300 border border-neutral-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="rounded-lg bg-neutral-900 px-3 py-2 font-medium hover:text-white text-neutral-300 border border-neutral-700"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// Export
export default Header;