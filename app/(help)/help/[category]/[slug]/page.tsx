import Link from "next/link";
import { notFound } from "next/navigation";
import HelpSearch from "@/app/ui/help/help-search";
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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link className="text-sm text-blue-600 hover:underline" href="/help">
          ← Help home
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link
            href={`/help/${article.category_slug}`}
            className="hover:underline"
          >
            {article.category_title}
          </Link>
          <span>·</span>
          <span>
            Updated {new Date(article.updated_at).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-5 max-w-2xl">
          <HelpSearch action={`/help/${article.category_slug}`} />
        </div>
      </div>

      <article className="rounded-md border bg-white p-6">
        <h1 className="text-2xl font-semibold">{article.title}</h1>
        {article.summary ? (
          <p className="mt-2 text-sm text-gray-600">{article.summary}</p>
        ) : null}

        {/* TEMP: render markdown as pre-wrap text (swap later for react-markdown) */}
        <div className="mt-6 whitespace-pre-wrap text-sm leading-6 text-gray-800">
          {article.body_md}
        </div>
      </article>
    </main>
  );
}
