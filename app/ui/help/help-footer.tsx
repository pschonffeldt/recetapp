import Link from "next/link";

export default function HelpFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} RecetApp · Help Center
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/help" className="text-gray-600 hover:text-gray-900">
            Help home
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link
            href="/dashboard/account"
            className="text-gray-600 hover:text-gray-900"
          >
            Account settings
          </Link>
          <Link
            href="/dashboard/notifications"
            className="text-gray-600 hover:text-gray-900"
          >
            Notifications
          </Link>
        </nav>
      </div>
    </footer>
  );
}
