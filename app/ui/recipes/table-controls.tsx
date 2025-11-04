"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { setParams } from "./url";

const TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function Controls({ initial }: { initial: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search with tiny debounce
  const [query, setQ] = useState(initial.query);
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(setParams(searchParams, { query }));
    }, 300);
    return () => clearTimeout(t);
  }, [query, router, searchParams]);

  const onType = (type: string) =>
    router.replace(setParams(searchParams, { type }));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={query}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search recipe..."
        className="h-10 w-64 rounded-md border border-gray-300 px-3 text-sm"
      />
      <select
        className="h-10 rounded-md border border-gray-300 px-3 text-sm"
        value={initial.type}
        onChange={(e) => onType(e.target.value)}
      >
        <option value="">All types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
