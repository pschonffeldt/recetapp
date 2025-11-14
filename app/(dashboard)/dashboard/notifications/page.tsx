import { fetchNotifications } from "@/app/lib/data";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import NotificationsList from "@/app/ui/notifications/notifications-list";

export const metadata: Metadata = { title: "Notifications" };

export default async function Page() {
  const { items, total, page, pageSize } = await fetchNotifications({
    page: 1,
    pageSize: 20,
    only: "all",
    status: "any",
  });

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Notifications",
            href: "/dashboard/notifications",
            active: true,
          },
        ]}
      />
      <NotificationsList
        items={items}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </main>
  );
}
