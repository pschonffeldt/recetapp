import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchNotificationUsers } from "@/app/lib/notifications/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import NewNotificationForm from "@/app/ui/notifications/notification-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
