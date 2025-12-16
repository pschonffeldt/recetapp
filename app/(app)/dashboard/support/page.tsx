// app/(app)/dashboard/support/page.tsx
import SupportForm from "@/app/ui/support/support-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Support" };

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard/support`);
  }

  return (
    <main className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Support</h1>
      <p className="mt-1 text-sm text-gray-600">
        Browse the Help Center for quick answers, or contact support if you’re
        stuck.
      </p>

      {/* Quick links to public help */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a
          className="rounded-md border bg-white p-4 hover:bg-gray-50"
          href="/help"
        >
          <div className="text-sm font-medium">Help Center</div>
          <div className="mt-1 text-xs text-gray-600">
            Guides + FAQs (public)
          </div>
        </a>

        <a
          className="rounded-md border bg-white p-4 hover:bg-gray-50"
          href="/help/faq"
        >
          <div className="text-sm font-medium">FAQ</div>
          <div className="mt-1 text-xs text-gray-600">Common questions</div>
        </a>

        <a
          className="rounded-md border bg-white p-4 hover:bg-gray-50"
          href="/help/guides"
        >
          <div className="text-sm font-medium">Guides</div>
          <div className="mt-1 text-xs text-gray-600">
            Step-by-step articles
          </div>
        </a>
      </section>

      {/* Support form */}
      <section className="mt-8 rounded-md border bg-gray-50 p-4 md:p-6">
        <h2 className="text-lg font-semibold">Contact support</h2>
        <p className="mt-1 text-sm text-gray-600">
          Tell us what happened, what you expected, and what you tried.
        </p>

        <div className="mt-4">
          <SupportForm />
        </div>
      </section>
    </main>
  );
}
