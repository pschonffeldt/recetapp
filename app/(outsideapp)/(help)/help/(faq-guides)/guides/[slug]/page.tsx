import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Button } from "@/app/ui/general/button";
import HelpHero from "@/app/ui/help/help-hero";
import HelpMarkdown from "@/app/ui/help/help-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/app/lib/guides/data";
import { formatDate } from "@/app/lib/utils/format-date";

export const metadata = { title: "Guide" };

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <>
      <HelpHero
        title="Guides"
        subtitle="Step-by-step tutorials with video walkthroughs."
        action="/help/guides"
      />

      <main className="mx-auto w-full max-w-5xl px-4 pt-10 pb-20 md:px-6">
        <Breadcrumbs
          className="text-xl md:text-2xl"
          breadcrumbs={[
            { label: "Help topics", href: "/help" },
            { label: "Guides", href: "/help/guides" },
            {
              label: guide.title,
              href: `/help/guides/${guide.slug}`,
              active: true,
            },
          ]}
        />

        <Link href="/help/guides" className="inline-block">
          <Button type="button" className="mb-6">
            ← All guides
          </Button>
        </Link>

        <article className="rounded-md border bg-white p-6">
          {guide.updatedAt ? (
            <div className="text-sm text-gray-500">
              Updated {formatDate(guide.updatedAt)}
            </div>
          ) : null}

          <h1 className="mt-2 text-2xl font-semibold">{guide.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{guide.summary}</p>

          {guide.youtubeId ? (
            <div className="mt-6 overflow-hidden rounded-xl border bg-black">
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${guide.youtubeId}`}
                  title={guide.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}

          {guide.bodyMd ? (
            <div className="mt-6">
              <HelpMarkdown content={guide.bodyMd} />
            </div>
          ) : null}
        </article>
      </main>
    </>
  );
}
