export default function WordCloudPlayer({
  maxWordsPerPlayer = 1,
}: {
  maxWordsPerPlayer?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <input
        className="w-full rounded-xl border border-disabled p-4 text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Enter a word or short phrase"
      />
      <p className="text-sm text-text-muted text-center">
        Up to {maxWordsPerPlayer} word{maxWordsPerPlayer > 1 ? "s" : ""}
      </p>
      <button className="bg-primary text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity">
        Submit
      </button>
    </div>
  );
}
