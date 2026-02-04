import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import HelpHero from "@/app/ui/help/help-hero";
import { GUIDES } from "@/app/lib/guides/data";
import CardLink from "@/app/ui/marketing/sections/card-link";
import { Button } from "@/app/ui/general/button";
import Link from "next/link";

export const metadata = { title: "Guides" };

export default async function GuidesPage() {
  return (
    <>
      <HelpHero
        title="Guides"
        subtitle="Step-by-step tutorials with video walkthroughs."
        action="/help/guides"
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <Breadcrumbs
          className="text-xl md:text-2xl"
          breadcrumbs={[
            { label: "Help topics", href: "/help" },
            { label: "Guides", href: "/help/guides", active: true },
          ]}
        />
        <Link href="/help" className="inline-block">
          <Button type="button" className="mb-6">
            ← Help home
          </Button>
        </Link>

        <div className="mt-6 grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <CardLink
              key={g.id}
              href={`/help/guides/${g.slug}`}
              title={g.title}
              description={g.summary}
            />
          ))}
        </div>
      </main>
    </>
  );
}
