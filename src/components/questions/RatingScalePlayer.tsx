export default function RatingScalePlayer({
  min,
  max,
  minLabel,
  maxLabel,
}: {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm text-text-muted">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
      <div className="flex gap-2 justify-between">
        {values.map((v) => (
          <button
            key={v}
            className="flex-1 aspect-square rounded-lg bg-surface border border-disabled font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
