import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchSupportInbox } from "@/app/lib/support/admin-data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import SupportInboxTable from "@/app/ui/support/admin/support-inbox-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support inbox",
};

export default async function Page() {
  await requireAdmin({
    callbackUrl: "/admin/support",
    redirectTo: "/dashboard",
  });

  const rows = await fetchSupportInbox();

  return (
    <main className="flex h-full min-h-0 flex-col">
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
      <div className="p-4 flex-1 min-h-0 lg:p-0">
        <SupportInboxTable rows={rows} />
      </div>
    </main>
  );
}
