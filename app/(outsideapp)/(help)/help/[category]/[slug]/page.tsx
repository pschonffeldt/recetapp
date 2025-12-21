import Link from "next/link";
import { notFound } from "next/navigation";
import HelpHero from "@/app/ui/help/help-hero";
import HelpMarkdown from "@/app/ui/help/help-markdown";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Button } from "@/app/ui/general/button";
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
        <Breadcrumbs
          className="text-sm md:text-base"
          breadcrumbs={[
            { label: "Topics", href: "/help" },
            {
              label: article.category_title,
              href: `/help/${article.category_slug}`,
            },
            {
              label: article.title,
              href: `/help/${article.category_slug}/${article.slug}`,
              active: true,
            },
          ]}
        />

        <Link href="/help" className="inline-block">
          <Button type="button" className="mb-6">
            ← Help home
          </Button>
        </Link>

        <article className="rounded-md border bg-white p-6">
          <div className="text-sm text-gray-500">
            Updated {new Date(article.updated_at).toLocaleDateString()}
          </div>

          <h1 className="mt-2 text-2xl font-semibold">{article.title}</h1>

          {article.summary ? (
            <p className="mt-2 text-sm text-gray-600">{article.summary}</p>
          ) : null}

          <div className="mt-6">
            <HelpMarkdown content={article.body_md} />
          </div>
        </article>
      </main>
    </>
  );
}
