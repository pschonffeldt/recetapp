import Link from "next/link";
import { notFound } from "next/navigation";
import HelpHero from "@/app/ui/help/help-hero";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Button } from "@/app/ui/general/button";
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
        <Breadcrumbs
          className="text-sm md:text-base"
          breadcrumbs={[
            { label: "Topics", href: "/help" },
            { label: cat.title, href: `/help/${cat.slug}`, active: true },
          ]}
        />

        <Link href="/help" className="inline-block">
          <Button type="button" className="mb-6">
            ← Help home
          </Button>
        </Link>

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
      </main>
    </>
  );
}
