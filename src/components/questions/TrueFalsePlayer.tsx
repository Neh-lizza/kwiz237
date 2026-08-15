export default function TrueFalsePlayer() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="bg-primary text-white rounded-xl py-8 font-bold text-xl hover:opacity-90 transition-opacity">
        True
      </button>
      <button className="bg-secondary text-white rounded-xl py-8 font-bold text-xl hover:opacity-90 transition-opacity">
        False
      </button>
    </div>
  );
}
