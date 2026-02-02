import { fetchHelpCategories, searchHelpArticles } from "@/app/lib/help/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Button } from "@/app/ui/general/button";
import HelpHero from "@/app/ui/help/help-hero";
import Link from "next/link";

export const metadata = {
  title: `FAQ`,
};

export default async function FAQPage({
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
      <HelpHero action="/faq" defaultValue={q} />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <Breadcrumbs
          className="text-sm md:text-base"
          breadcrumbs={[{ label: "FAQ", href: "/faq", active: true }]}
        />

        <Link href="/help" className="inline-block">
          <Button type="button" className="mb-6">
            ← Help home
          </Button>
        </Link>

        {q ? (
          <>
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
        )}
      </main>
    </>
  );
}
