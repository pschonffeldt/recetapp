import Link from "next/link";

type FeaturedTestimonialCardProps = {
  eyebrow?: string;
  quote: string;
  body: string;
  authorName: string;
  authorMeta?: string;
  cta?: { href: string; label: string };
  media?: React.ReactNode;

  // If you want to render a real avatar later
  avatar?: React.ReactNode;

  className?: string;
};

export function FeaturedTestimonialCard({
  eyebrow = "Featured story",
  quote,
  body,
  authorName,
  authorMeta,
  cta = { href: "/signup", label: "Try it free" },
  media,
  avatar,
  className,
}: FeaturedTestimonialCardProps) {
  return (
    <div className={["lg:col-span-8", className ?? ""].join(" ")}>
      <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50" />

        <div className="relative grid gap-6 p-6 md:grid-cols-2 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {eyebrow}
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              {quote}
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>

            <div className="mt-5 flex items-center gap-3 text-sm text-gray-700">
              {avatar ?? <span className="h-9 w-9 rounded-full bg-gray-200" />}

              <div>
                <div className="font-semibold text-gray-900">{authorName}</div>
                {authorMeta && (
                  <div className="text-xs text-gray-600">{authorMeta}</div>
                )}
              </div>
            </div>

            {cta && (
              <div className="mt-6">
                <Link
                  href={cta.href}
                  className="inline-flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>

          {/* Media slot */}
          {media ?? (
            <div className="rounded-xl border bg-white p-3 shadow-sm">
              <div className="h-52 w-full rounded-lg bg-gray-100 md:h-56" />
              <div className="mt-3 text-xs text-gray-500">
                Featured preview (swap for video/image later)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
