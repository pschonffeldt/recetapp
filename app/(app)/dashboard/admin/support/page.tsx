import { fetchSupportInbox } from "@/app/lib/support/admin-data";
import SupportInboxTable from "@/app/ui/support/admin/support-inbox-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Support inbox" };

export default async function Page() {
  const session = await auth();
  const role = (session?.user as any)?.user_role;

  if (!session?.user) redirect("/login?callbackUrl=/dashboard/admin/support");
  if (role !== "admin") redirect("/dashboard"); // or notFound()

  const rows = await fetchSupportInbox();

  return (
    <main className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Support inbox</h1>
      <p className="mt-1 text-sm text-gray-600">
        Review incoming support messages and mark them as solved.
      </p>

      <div className="mt-6">
        <SupportInboxTable rows={rows} />
      </div>
    </main>
  );
}
