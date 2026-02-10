import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchSupportInbox } from "@/app/lib/support/admin-data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
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
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          {
            label: "Support inbox",
            href: "/admin/support",
            active: true,
          },
        ]}
      />
      <div className="mt-6 flex-1 min-h-0">
        <SupportInboxTable rows={rows} />
      </div>
    </main>
  );
}
