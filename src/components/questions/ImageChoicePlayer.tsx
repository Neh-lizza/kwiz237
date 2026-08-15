export default function ImageChoicePlayer({
  options,
}: {
  options: { id: string; label: string; imageUrl: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          className="rounded-xl overflow-hidden border-2 border-disabled hover:border-primary transition-colors bg-surface"
        >
          <div
            className="w-full aspect-square bg-cover bg-center bg-disabled/40"
            style={{ backgroundImage: `url(${opt.imageUrl})` }}
          />
          <div className="p-2 text-sm font-medium">{opt.label}</div>
        </button>
      ))}
    </div>
  );
}
