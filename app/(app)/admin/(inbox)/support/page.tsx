import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchSupportInbox } from "@/app/lib/support/admin-data";
import SupportInboxTable from "@/app/ui/support/admin/support-inbox-table";

export const metadata = { title: "Support inbox" };

export default async function Page() {
  await requireAdmin({
    callbackUrl: "/admin/support",
    redirectTo: "/dashboard",
  });

  const rows = await fetchSupportInbox();

  return (
    <main className="flex h-full min-h-0 flex-col p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Support inbox</h1>
      <p className="mt-1 text-sm text-gray-600">
        Review incoming support messages and mark them as solved.
      </p>
      <div className="mt-6 flex-1 min-h-0">
        <SupportInboxTable rows={rows} />
      </div>
    </main>
  );
}
