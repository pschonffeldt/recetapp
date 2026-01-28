import Link from "next/link";
import { CheckDot } from "./check-dot";

export type Plan = {
  label: string;
  title: string;
  price: string;
  sub: string;
  highlight?: boolean;
  ctaHref: string;
  ctaText: string;
  features: string[];
};

export function PlanCard({
  label,
  title,
  price,
  sub,
  highlight,
  ctaHref,
  ctaText,
  features,
}: Plan) {
  return (
    <div
      className={[
        "relative rounded-2xl border bg-white p-7 shadow-sm",
        highlight ? "border-blue-200 ring-1 ring-blue-200" : "border-gray-200",
      ].join(" ")}
    >
      {highlight && (
        <div className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </div>
      )}

      <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
        {title}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-4xl font-semibold tracking-tight text-gray-900">
          {price}
        </div>
        <div className="text-sm text-gray-600">{sub}</div>
      </div>

      <Link
        href={ctaHref}
        className={[
          "mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          highlight
            ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
            : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline-blue-600",
        ].join(" ")}
      >
        {ctaText}
      </Link>

      <div className="mt-7 border-t pt-6">
        <div className="text-sm font-semibold text-gray-900">Includes</div>

        <div className="mt-4 space-y-3 text-sm text-gray-700">
          {features.map((f) => (
            <div key={f} className="flex gap-2">
              <CheckDot />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
