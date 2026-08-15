export default function OpenTextPlayer({
  maxLength,
}: {
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <textarea
        maxLength={maxLength}
        rows={4}
        className="w-full rounded-xl border border-disabled p-4 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Type your answer..."
      />
      <button className="bg-primary text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity">
        Submit
      </button>
    </div>
  );
}
