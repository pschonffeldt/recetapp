import { fetchReleaseNotes } from "@/app/lib/marketing/data";
import { APP } from "@/app/lib/utils/app";

function formatReleaseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export const metadata = {
  title: `Release notes`,
};

export default async function ReleasesPage() {
  const releases = await fetchReleaseNotes();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-0">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">
        Release notes
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {`What's new in ${APP.legalName}.`}
      </p>

      {releases.length === 0 && (
        <p className="text-sm text-gray-500">No releases yet.</p>
      )}

      <ul className="space-y-6">
        {releases.map((release) => (
          <li
            key={release.id}
            className="rounded-lg border bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{release.title}</h2>
                <div className="flex flex-row gap-1 text-xs text-gray-500">
                  <span>Released:</span>
                  <span>{formatReleaseDate(release.releasedAt)}</span>
                </div>
              </div>
            </div>

            <p className="whitespace-pre-line text-sm text-gray-700">
              {release.body}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
