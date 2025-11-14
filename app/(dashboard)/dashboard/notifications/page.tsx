import { fetchNotifications } from "@/app/lib/data";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import NotificationsList from "@/app/ui/notifications/notifications-list";

export const metadata: Metadata = { title: "Notifications" };

type Search = {
  searchParams?: {
    page?: string;
    only?: "all" | "personal" | "broadcasts";
    status?: "any" | "unread" | "read" | "archived";
  };
};

export default async function Page({ searchParams }: Search) {
  const page = Math.max(1, Number(searchParams?.page ?? "1"));
  const only = (searchParams?.only as any) ?? "all";
  const status = (searchParams?.status as any) ?? "any";

  const { items, total, pageSize } = await fetchNotifications({
    page,
    pageSize: 10,
    only,
    status,
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
