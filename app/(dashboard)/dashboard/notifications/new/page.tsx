import { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import { requireAdmin } from "@/app/lib/auth-helpers";
import NewNotificationForm from "@/app/ui/notifications/new-notification-form";

export const metadata: Metadata = { title: "New Notification" };

export default async function Page() {
  // Gate this route to admins/staff
  try {
    await requireAdmin();
  } catch {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Notifications", href: "/dashboard/notifications" },
          { label: "New", href: "/dashboard/notifications/new", active: true },
        ]}
      />
      <NewNotificationForm />
    </main>
  );
}
