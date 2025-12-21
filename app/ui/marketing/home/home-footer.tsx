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
        {/* Footer columns */}
        <div className="grid gap-8 md:col-span-8 md:grid-cols-5">
          {/* Product */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Product
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <Link href="/signup" className="block hover:underline">
                Sign up
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
              <Link href="/features" className="block hover:underline">
                Features
              </Link>
              <Link href="/pricing" className="block hover:underline">
                Pricing
              </Link>
            </div>
          </div>
          {/* Help */}
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
          {/* Company */}
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
          {/* In app links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              In app
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <Link href="/dashboard" className="block hover:underline">
                Dashboard
              </Link>
              <Link href="/dashboard/recipes" className="block hover:underline">
                Recipes
              </Link>
              <Link
                href="/dashboard/shopping-list"
                className="block hover:underline"
              >
                Shopping list
              </Link>
              <Link
                href="/dashboard/discover"
                className="block hover:underline"
              >
                Discover
              </Link>
              <Link
                href="/dashboard/notifications"
                className="block hover:underline"
              >
                Notifications
              </Link>
              <Link href="/dashboard/account" className="block hover:underline">
                Acount
              </Link>
              <Link href="/dashboard/support" className="block hover:underline">
                Support
              </Link>
            </div>
          </div>
          {/* Socials */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Follow us
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <Link href="/about" className="block hover:underline">
                Youtube
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
        <div>Developed in Chile</div>
      </div>
    </footer>
  );
}
