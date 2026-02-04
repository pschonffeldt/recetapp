import { FAQS } from "@/app/lib/help/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Button } from "@/app/ui/general/button";
import HelpHero from "@/app/ui/help/help-hero";
import Link from "next/link";

export const metadata = {
  title: `FAQ`,
};

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  return (
    <>
      <HelpHero action="/help" defaultValue={q} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <Breadcrumbs
          className="text-xl md:text-2xl"
          breadcrumbs={[{ label: "FAQ", href: "/faq", active: true }]}
        />

        <Link href="/help" className="inline-block">
          <Button type="button" className="mb-6">
            ← Help home
          </Button>
        </Link>
        <div className="grid gap-4 pb-10 sm:grid-cols-1 lg:grid-cols-1">
          {FAQS.map((f) => (
            <div
              key={f.id}
              className="rounded-md border bg-white p-6 shadow-sm transition hover:shadow"
            >
              <div className="text-base font-semibold">{f.question}</div>
              <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
