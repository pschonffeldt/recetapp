import { fetchReleaseNotes } from "@/app/lib/marketing/data";

function formatReleaseDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export const metadata = {
  title: "Release notes – RecetApp",
};

export default async function ReleasesPage() {
  const releases = await fetchReleaseNotes();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-0">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Release notes
      </h1>
      <p className="text-sm text-gray-500 mb-6">What&apos;s new in RecetApp.</p>

      {releases.length === 0 && (
        <p className="text-sm text-gray-500">No releases yet.</p>
      )}

      <ul className="space-y-6">
        {releases.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{r.title}</h2>
              <div className="flex flex-row gap-1">
                <span className="text-xs text-gray-500">Release:</span>
                <span className="text-xs text-gray-500">
                  {formatReleaseDate(r.releasedAt)}
                </span>
              </div>
            </div>
            {/* simple markdown-ish rendering: keep as text for now */}
            <p className="whitespace-pre-line text-sm text-gray-700">
              {r.body}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
