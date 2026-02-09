import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchContactInbox } from "@/app/lib/contact/contact-data";
import ContactInboxTable from "@/app/ui/contact/admin/contact-inbox-table";

export const metadata = { title: "Public inbox" };

export default async function Page() {
  await requireAdmin({
    callbackUrl: "/admin/contact",
    redirectTo: "/dashboard",
  });

  const rows = await fetchContactInbox();

  return (
    <main className="flex h-full min-h-0 flex-col p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Public inbox</h1>
      <p className="mt-1 text-sm text-gray-600">
        Review incoming messages from our public website.
      </p>
      <div className="mt-6 flex-1 min-h-0">
        <ContactInboxTable rows={rows} />
      </div>
    </main>
  );
}
