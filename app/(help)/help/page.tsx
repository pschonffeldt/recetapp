import Link from "next/link";
import { auth } from "@/auth";

export default async function HelpPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const supportHref = isLoggedIn
    ? "/dashboard/support"
    : "/login?callbackUrl=/dashboard/support";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Help</h1>

      <div className="mt-6 rounded-lg border bg-white p-4">
        <h2 className="text-lg font-medium">Need more help?</h2>
        <p className="mt-1 text-sm text-gray-600">
          Contact support if you can’t find the answer in the guides or FAQ.
        </p>

        <Link
          href={supportHref}
          className="mt-3 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Contact support
        </Link>

        {!isLoggedIn && (
          <p className="mt-2 text-xs text-gray-500">
            You’ll need to sign in first.
          </p>
        )}
      </div>
    </main>
  );
}
