import Link from "next/link";
import HelpSearch from "@/app/ui/help/help-search";
import { fetchHelpCategories, searchHelpArticles } from "@/app/lib/help/data";

export const metadata = { title: "Help" };

export default async function HelpHome({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const [categories, results] = await Promise.all([
    fetchHelpCategories(),
    q ? searchHelpArticles(q) : Promise.resolve([]),
  ]);

  return (
    <main>
      {/* Header */}
      <div className="rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-10 text-white">
        <h1 className="text-2xl font-semibold">RecetApp Help Center</h1>
        <p className="mt-1 text-sm text-white/90">
          Find answers, guides, and troubleshooting steps.
        </p>

        <div className="mt-6 max-w-2xl">
          <HelpSearch action="/help" defaultValue={q} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {q ? (
          <>
            <h2 className="mb-4 text-lg font-semibold">
              Search results for “{q}”
            </h2>

            {results.length === 0 ? (
              <p className="text-sm text-gray-600">
                No results found. Try a different search.
              </p>
            ) : (
              <ul className="space-y-3">
                {results.map((a) => (
                  <li key={a.id} className="rounded-md border bg-white p-4">
                    <p className="text-xs text-gray-500">{a.category_title}</p>
                    <Link
                      className="text-base font-semibold text-blue-600 hover:underline"
                      href={`/help/${a.category_slug}/${a.slug}`}
                    >
                      {a.title}
                    </Link>
                    {a.summary ? (
                      <p className="mt-1 text-sm text-gray-700">{a.summary}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-semibold">Topics</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/help/${c.slug}`}
                  className="rounded-md border bg-white p-6 shadow-sm transition hover:shadow"
                >
                  <div className="text-base font-semibold">{c.title}</div>
                  <p className="mt-2 text-sm text-gray-600">
                    {c.description ?? "Explore articles and guides."}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
