import { auth } from "@/auth";
import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import NotificationsList from "@/app/ui/notifications/notifications-list";
import { fetchNotifications } from "@/app/lib/data";

export const metadata: Metadata = { title: "Notifications" };

type Search = {
  page?: string;
  only?: "all" | "personal" | "broadcasts";
  status?: "any" | "unread" | "read" | "archived";
  tab?: string;
};

// Tabs we show in the UI
type TabKey = "all" | "unread" | "announcements" | "maintenance" | "features";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "announcements", label: "Announcements" },
  { key: "maintenance", label: "Maintenance" },
  { key: "features", label: "New Features" },
];

// Map a tab to the filters we pass into fetchNotifications
function mapTabToFilters(tab: TabKey) {
  switch (tab) {
    case "unread":
      return { status: "unread" as const, kind: "all" as const };
    case "maintenance":
      return { status: "any" as const, kind: "maintenance" as const };
    case "features":
      return { status: "any" as const, kind: "feature" as const };
    case "announcements":
      // For now, “Announcements” maps to the generic `message` kind
      return { status: "any" as const, kind: "message" as const };
    case "all":
    default:
      return { status: "any" as const, kind: "all" as const };
  }
}

export default async function Page({
  searchParams,
}: {
  // NOTE: in this repo, searchParams is a Promise
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;

  // Admin check (show “New notification” button)
  const session = await auth();
  const role = (session?.user as any)?.user_role ?? "user";
  const isAdmin = role === "admin";

  const page = Math.max(1, Number(sp?.page ?? 1));
  const only = (sp?.only ?? "all") as NonNullable<Search["only"]>;

  // Decide active tab
  const tabParam = sp?.tab as TabKey | undefined;
  const activeTab: TabKey =
    tabParam && TABS.some((t) => t.key === tabParam) ? tabParam : "all";

  const { status, kind } = mapTabToFilters(activeTab);

  const {
    items,
    total,
    page: p,
    pageSize,
  } = await fetchNotifications({
    page,
    // Here we set the max number of notifications per page
    pageSize: 10,
    only,
    status,
    kind,
  });

  return (
    <main>
      {/* Upper helpers like breadcrumbs and buttons */}
      <div className="mb-2 flex items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            {
              label: "Notifications",
              href: "/dashboard/notifications",
              active: true,
            },
          ]}
        />
      </div>

      {/* Tabs */}
      <div className="ml-4 flex items-center flex-wrap gap-2">
        {TABS.map((t) => {
          const isActive = t.key === activeTab;

          // Preserve `only` in the URL if it’s not the default
          const params = new URLSearchParams();
          params.set("tab", t.key);
          if (only !== "all") params.set("only", only);
          if (page !== 1) params.set("page", String(page));

          const href = `/dashboard/notifications?${params.toString()}`;
          // Returning the and highlighting the active filter tab
          return (
            <Link
              key={t.key}
              href={href}
              className={
                "rounded-t-md px-4 py-2 text-xs font-medium " +
                (isActive
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-400 opacity-50")
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      {/* Notification list */}
      <NotificationsList
        items={items}
        total={total}
        page={p}
        pageSize={pageSize}
      />
    </main>
  );
}
