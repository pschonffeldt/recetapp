import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchContactInbox } from "@/app/lib/contact/contact-data";
import ContactInboxTable from "@/app/ui/contact/admin/contact-inbox-table";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public inbox",
};

export default async function PublicInboxPage() {
  await requireAdmin({
    callbackUrl: "/admin/contact",
    redirectTo: "/dashboard",
  });

  const rows = await fetchContactInbox();

  return (
    <main className="flex h-full min-h-0 flex-col">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          {
            label: "Public inbox",
            href: "/admin/support",
            active: true,
          },
        ]}
      />
      <div className="p-4 flex-1 min-h-0 lg:p-0">
        <ContactInboxTable rows={rows} />
      </div>
    </main>
  );
}
