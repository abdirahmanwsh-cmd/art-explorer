export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <div className="text-2xl font-semibold tracking-tight text-white">Art Explorer</div>

        <div className="ml-auto flex items-center gap-3 w-full max-w-md">
          <input
            type="search"
            placeholder="Search artists, titles, styles…"
            className="w-full rounded-lg bg-neutral-900 text-neutral-100 placeholder:text-neutral-500
                       border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
          />
          <button className="rounded-lg bg-neutral-100 text-neutral-900 px-3 py-2 font-medium hover:bg-white">
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}