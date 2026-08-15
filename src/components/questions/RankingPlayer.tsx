export default function RankingPlayer({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-muted mb-1">
        Drag to put these in the correct order
      </p>
      {items.map((item, i) => (
        <div
          key={item.id}
          className="bg-surface border border-disabled rounded-xl px-4 py-3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
        >
          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
            {i + 1}
          </span>
          {item.label}
        </div>
      ))}
      <button className="bg-primary text-white rounded-xl py-3 font-semibold mt-2 hover:opacity-90 transition-opacity">
        Submit Order
      </button>
    </div>
  );
}
