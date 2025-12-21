import Link from "next/link";

export default function MarketingTopNavBar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between text-base px-4 py-4 md:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          RecetApp
        </Link>

        <nav className="hidden items-start justify-start gap-6 text-gray-700 md:flex">
          <Link href="/about" className="hover:text-gray-900 hover:underline">
            About
          </Link>
          <Link
            href="/features"
            className="hover:text-gray-900 hover:underline"
          >
            Features
          </Link>
          <Link href="/pricing" className="hover:text-gray-900 hover:underline">
            Pricing
          </Link>
          <Link href="/help" className="hover:text-gray-900 hover:underline">
            Help
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-gray-700 hover:text-gray-900 hover:underline md:inline-block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
