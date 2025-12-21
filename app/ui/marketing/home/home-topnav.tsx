import Link from "next/link";

export default function MarketingTopNavBar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          RecetApp
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-gray-700 md:flex">
          <Link href="/roadmap" className="hover:text-gray-900">
            Roadmap
          </Link>
          <Link href="/releases" className="hover:text-gray-900">
            Releases
          </Link>
          <Link href="/help" className="hover:text-gray-900">
            Help
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-gray-700 hover:text-gray-900 md:inline-block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-500"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
