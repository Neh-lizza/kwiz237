"use client";

import { useEffect, useState } from "react";
import { Plus, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (res.ok) setCategories(data.categories);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Could not create category");
    } else {
      setCategories((prev) => [...prev, data.category].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Categories</h1>
      <p className="text-sm text-text-muted mt-1">
        Organize your question bank by topic.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 flex gap-2 max-w-md"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Geography"
          className="flex-1 rounded-lg border border-disabled px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="bg-primary text-white rounded-lg px-4 py-2 font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          <Plus size={16} />
          Add
        </button>
      </form>
      {error && <p className="text-sm text-incorrect mt-2">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-2 max-w-2xl">
        {loading && <p className="text-sm text-text-muted">Loading...</p>}
        {!loading && categories.length === 0 && (
          <p className="text-sm text-text-muted">
            No categories yet - add your first one above.
          </p>
        )}
        {categories.map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1.5 bg-surface border border-disabled rounded-full px-3 py-1.5 text-sm text-text"
          >
            <Tag size={13} className="text-text-muted" />
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}
