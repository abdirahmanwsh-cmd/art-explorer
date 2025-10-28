import Card from "./Card.jsx";

function Row({ title, items = [], source, onOpen }) {
  return (
    <section className="my-6">
      {title ? (
        <h2 className="px-4 mb-2 text-base sm:text-lg font-semibold tracking-tight text-neutral-100">
          {title}
        </h2>
      ) : null}

      <div
        className="flex gap-3 overflow-x-auto snap-x px-3 sm:px-4 max-w-full pb-4
                   [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const keyId =
            item?.objectID ?? item?.id ?? item?.artwork_id ?? item?.objectId ?? Math.random();
        const itemSource = item?.__source || source;
          return (
            <div key={`${keyId}_${itemSource}`} className="snap-start">
              <Card item={item} source={itemSource} onOpen={onOpen} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Row;