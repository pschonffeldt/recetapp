import { fetchNotificationUsers } from "@/app/lib/notifications/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import NewNotificationForm from "@/app/ui/notifications/notification-form";
import { Metadata } from "next";

export const metadata: Metadata = { title: "New Notification" };

export default async function Page() {
  const users = await fetchNotificationUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Notifications", href: "/notifications" },
          { label: "New", href: "/notifications/new", active: true },
        ]}
      />
      <NewNotificationForm users={users} />
    </main>
  );
}
