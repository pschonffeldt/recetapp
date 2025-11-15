import { auth } from "@/auth";
import { Metadata } from "next";
import Link from "next/link";
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
  searchParams?: Search;
}) {
  // Admin check (to show “New notification” button)
  const session = await auth();
  const email = (session?.user as any)?.email?.toLowerCase() ?? "";
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isAdmin = !!email && admins.includes(email);

  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const only = (searchParams?.only ?? "all") as NonNullable<Search["only"]>;
  const status = (searchParams?.status ?? "any") as NonNullable<
    Search["status"]
  >;

  // Fetch notifications (flat options object)
  const {
    items,
    total,
    page: p,
    pageSize,
  } = await fetchNotifications({
    page,
    pageSize: 10, // override default page size if desired
    only,
    status,
  });

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            {
              label: "Notifications",
              href: "/dashboard/notifications",
              active: true,
            },
          ]}
        />
        {isAdmin && (
          <Link
            href="/dashboard/notifications/new"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black/80"
          >
            New notification
          </Link>
        )}
      </div>

      <NotificationsList
        items={items}
        total={total}
        page={p}
        pageSize={pageSize}
      />
    </main>
  );
}
