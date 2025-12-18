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
    <>
      {/* Full-width hero (same colors as before) */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-cyan-500">
        {/* Top row inside hero */}
        <div className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-6">
          <div className="flex items-center justify-between gap-3 text-white">
            <Link href="/help" className="text-sm font-semibold text-white">
              RecetApp Help
            </Link>

            <div className="flex items-center gap-2 text-sm text-white/90">
              <span aria-hidden className="text-base">
                🌐
              </span>
              <span>English</span>
              <span aria-hidden className="ml-1">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Centered title + search */}
        <div className="mx-auto w-full max-w-5xl px-4 py-14 md:px-6">
          <div className="flex flex-col items-center text-center text-white">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How can we help? <span aria-hidden>👋</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/90">
              Find answers, guides, and troubleshooting steps.
            </p>

            <div className="mt-8 w-full max-w-2xl">
              <HelpSearch action="/help" defaultValue={q} />
            </div>
          </div>
        </div>
      </section>

      {/* Body (constrained) */}
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
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
      </main>
    </>
  );
}
