import { SparklesOverlay } from "@/app/lib/marketing/helpers";
import Link from "next/link";

export default function MarketingCTA() {
  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-10 text-white md:p-12">
      <SparklesOverlay />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Ready to organize your recipes?
          </h2>
          <p className="mt-4 text-sm text-white/90 md:text-base">
            Start free. Upgrade only if you need more.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-blue-700 hover:bg-white/90"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/25 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/15"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
