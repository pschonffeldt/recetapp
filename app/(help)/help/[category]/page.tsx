import Link from "next/link";
import { notFound } from "next/navigation";
import HelpSearch from "@/app/ui/help/help-search";
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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link className="text-sm text-blue-600 hover:underline" href="/help">
          ← Help home
        </Link>

        <h1 className="mt-2 text-2xl font-semibold">{cat.title}</h1>
        {cat.description ? (
          <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
        ) : null}

        <div className="mt-5 max-w-2xl">
          <HelpSearch action={`/help/${cat.slug}`} defaultValue={q} />
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-gray-600">
          No articles found{q ? " for that search." : " yet."}
        </p>
      ) : (
        <ul className="space-y-2">
          {articles.map((a) => (
            <li key={a.id} className="rounded-md border bg-white p-4">
              <Link
                href={`/help/${a.category_slug}/${a.slug}`}
                className="font-semibold text-blue-600 hover:underline"
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
    </main>
  );
}
