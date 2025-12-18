import Link from "next/link";
import { notFound } from "next/navigation";
import HelpHero from "@/app/ui/help/help-hero";
import { fetchHelpArticleBySlugs } from "@/app/lib/help/data";

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const article = await fetchHelpArticleBySlugs(category, slug);
  if (!article) notFound();

  return (
    <>
      <HelpHero
        title={article.category_title}
        subtitle="Browse articles and troubleshooting steps."
        action={`/help/${article.category_slug}`}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <Link className="text-sm text-blue-600 hover:underline" href="/help">
          ← Help home
        </Link>

        <div className="mt-2 text-sm text-gray-500">
          <Link
            href={`/help/${article.category_slug}`}
            className="hover:underline"
          >
            {article.category_title}
          </Link>
          <span className="mx-2">·</span>
          <span>
            Updated {new Date(article.updated_at).toLocaleDateString()}
          </span>
        </div>

        <article className="mt-8 rounded-md border bg-white p-6">
          <h1 className="text-2xl font-semibold">{article.title}</h1>
          {article.summary ? (
            <p className="mt-2 text-sm text-gray-600">{article.summary}</p>
          ) : null}

          <div className="mt-6 whitespace-pre-wrap text-sm leading-6 text-gray-800">
            {article.body_md}
          </div>
        </article>
      </main>
    </>
  );
}
