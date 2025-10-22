export default function Row({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="px-4 mx-auto max-w-6xl text-lg font-semibold text-neutral-100">{title}</h2>

      <div className="mt-3">
        <div
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 mx-auto max-w-6xl pb-6
                     [scrollbar-width:thin] [scrollbar-color:#525252_#0a0a0a]"
        >
          {/* placeholder cards for now */}
          {children ?? Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-44 w-32 shrink-0 rounded-xl bg-neutral-900 border border-neutral-800"
            />
          ))}
        </div>
      </div>
    </section>
  );
}