import { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { requireAdmin } from "@/app/lib/auth-helpers";
import NewNotificationForm from "@/app/ui/notifications/notification-form";
import { fetchNotificationUsers } from "@/app/lib/data";

export const metadata: Metadata = { title: "New Notification" };

export default async function Page() {
  // Gate this route to admins/staff
  try {
    await requireAdmin();
  } catch {
    notFound();
  }
  const users = await fetchNotificationUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Notifications", href: "/dashboard/notifications" },
          { label: "New", href: "/dashboard/notifications/new", active: true },
        ]}
      />
      <NewNotificationForm users={users} />
    </main>
  );
}
