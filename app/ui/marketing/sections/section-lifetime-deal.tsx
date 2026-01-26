import Link from "next/link";
import { CheckDot } from "./check-dot";

type SectionLifetimeDealProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;

  bullets: string[];

  cardTitle: string;
  cardDescription: string;

  // If provided -> renders a real Link button
  ctaHref?: string;
  ctaText?: string;

  // If CTA not provided -> render disabled text pill
  disabledCtaText?: string;

  footnote?: string;
  className?: string;
};

export function SectionLifetimeDeal({
  id,
  eyebrow = "Limited offer (exploring)",
  title,
  description,
  bullets,
  cardTitle,
  cardDescription,
  ctaHref,
  ctaText,
  disabledCtaText = "Join waitlist (not open yet)",
  footnote = "No spam. One email when it launches (if it launches).",
  className,
}: SectionLifetimeDealProps) {
  const hasCta = Boolean(ctaHref && ctaText);

  return (
    <section
      id={id}
      className={[
        "mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24",
        className ?? "",
      ].join(" ")}
    >
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {eyebrow}
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              {title}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-700 md:text-base">
              {description}
            </p>

            <div className="mt-7 space-y-2 text-sm text-gray-700">
              {bullets.map((t) => (
                <div key={t} className="flex gap-2">
                  <CheckDot />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="text-sm font-semibold text-gray-900">
                {cardTitle}
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {cardDescription}
              </p>

              {hasCta ? (
                <Link
                  href={ctaHref!}
                  className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {ctaText}
                </Link>
              ) : (
                <div className="mt-5">
                  <div className="flex h-10 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
                    {disabledCtaText}
                  </div>
                </div>
              )}

              {footnote && (
                <p className="mt-3 text-xs text-gray-500">{footnote}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
