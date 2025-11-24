import { fetchRoadmapGrouped } from "@/app/lib/data";

export const metadata = {
  title: "Roadmap – RecetApp",
};

const COLUMN_LABELS: Record<"planned" | "in_progress" | "shipped", string> = {
  planned: "Planned",
  in_progress: "In progress",
  shipped: "Shipped",
};

export default async function RoadmapPage() {
  const { planned, inProgress, shipped } = await fetchRoadmapGrouped();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-0">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Roadmap</h1>
      <p className="text-sm text-gray-500 mb-6">
        High-level view of what&apos;s planned, in progress, and shipped.
      </p>

      <div className="grid gap-4 md:grid-cols-3 md:items-start">
        <RoadmapColumn
          title={COLUMN_LABELS.planned}
          items={planned}
          emptyMessage="No planned items yet."
        />
        <RoadmapColumn
          title={COLUMN_LABELS.in_progress}
          items={inProgress}
          emptyMessage="Nothing in progress right now."
        />
        <RoadmapColumn
          title={COLUMN_LABELS.shipped}
          items={shipped}
          emptyMessage="No shipped items yet."
        />
      </div>
    </main>
  );
}

type ColumnItem = {
  id: string;
  title: string;
  description: string | null;
};

function RoadmapColumn({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: ColumnItem[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h2>

      <div className="mt-3 space-y-3">
        {items.length === 0 && (
          <p className="text-xs text-gray-400">{emptyMessage}</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <h3 className="text-sm font-medium">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-xs text-gray-600 whitespace-pre-line">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
