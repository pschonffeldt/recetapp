import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import NotificationsList from "@/app/ui/notifications/notifications-list";
import { fetchNotifications } from "@/app/lib/data";

export const metadata: Metadata = { title: "Notifications" };

type Search = {
  page?: string;
  only?: "all" | "personal" | "broadcasts";
  status?: "any" | "unread" | "read" | "archived";
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;

  const page = sp.page ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;
  const only = (sp.only ?? "all") as "all" | "personal" | "broadcasts";
  const status = (sp.status ?? "any") as "any" | "unread" | "read" | "archived";

  const {
    items,
    total,
    page: currentPage,
    pageSize,
  } = await fetchNotifications({
    page,
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
        page={currentPage}
        pageSize={pageSize}
      />
    </main>
  );
}
