import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchNotificationUsers } from "@/app/lib/notifications/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import NewNotificationForm from "@/app/ui/notifications/notification-form";
import { Metadata } from "next";

export const metadata: Metadata = { title: "New Notification" };

export default async function Page() {
  await requireAdmin({
    callbackUrl: "/admin/notification-center",
    redirectTo: "/dashboard",
  });
  const users = await fetchNotificationUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          {
            label: "Notifications",
            href: "/admin/notification-center",
            active: true,
          },
        ]}
      />

      <NewNotificationForm users={users} />
    </main>
  );
}
