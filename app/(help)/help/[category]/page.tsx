import Link from "next/link";
import { notFound } from "next/navigation";
import HelpHero from "@/app/ui/help/help-hero";
import {
  fetchHelpCategoryBySlug,
  fetchHelpArticlesByCategory,
} from "@/app/lib/help/data";

export default async function HelpCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { category } = await params;
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const cat = await fetchHelpCategoryBySlug(category);
  if (!cat) notFound();

  const articles = await fetchHelpArticlesByCategory(cat.id, q);

  return (
    <>
      <HelpHero
        title={cat.title}
        subtitle={cat.description ?? "Browse articles in this topic."}
        action={`/help/${cat.slug}`}
        defaultValue={q}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <Link className="text-sm text-blue-600 hover:underline" href="/help">
          ← Help home
        </Link>

        <div className="mt-6">
          {articles.length === 0 ? (
            <p className="text-sm text-gray-600">
              No articles found{q ? " for that search." : " yet."}
            </p>
          ) : (
            <ul className="space-y-3">
              {articles.map((a) => (
                <li key={a.id} className="rounded-md border bg-white p-4">
                  <Link
                    href={`/help/${a.category_slug}/${a.slug}`}
                    className="text-base font-semibold text-blue-600 hover:underline"
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
        </div>
      </main>
    </>
  );
}
