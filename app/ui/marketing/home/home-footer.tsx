import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="mt-14 border-t pt-10">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="text-sm font-semibold text-gray-900">RecetApp</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
            A calmer way to save recipes, reuse ingredients, and plan meals
            without chaos.
          </p>
        </div>

        <div className="grid gap-8 md:col-span-8 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Product
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <Link href="/signup" className="block hover:underline">
                Get started
              </Link>
              <Link href="/login" className="block hover:underline">
                Log in
              </Link>
              <Link href="/releases" className="block hover:underline">
                Releases
              </Link>
              <Link href="/roadmap" className="block hover:underline">
                Roadmap
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Help
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <Link href="/help" className="block hover:underline">
                Help Center
              </Link>
              <Link
                href="/help/getting-started"
                className="block hover:underline"
              >
                Getting started
              </Link>
              <Link href="/help/recipes" className="block hover:underline">
                Recipes
              </Link>
              <Link
                href="/help/troubleshooting"
                className="block hover:underline"
              >
                Troubleshooting
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Company
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <Link href="/about" className="block hover:underline">
                About
              </Link>
              <Link href="/privacy" className="block hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="block hover:underline">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col flex-wrap items-start justify-between gap-3 text-xs text-gray-500">
        <div>© {new Date().getFullYear()} RecetApp, app version 1.0.0.</div>
        <div>Developed in Chile with Love</div>
      </div>
    </footer>
  );
}
