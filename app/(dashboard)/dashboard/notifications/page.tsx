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
  tab?: string; // 👈 NEW: which tab is active
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
    pageSize: 10,
    only,
    status, // derived from tab
    kind, // NEW: you'll need kind support in fetchNotifications
  });

  return (
    <main>
      {/* Upper helpers like breadcrumbs and buttons */}
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
        {/* For adsmins only; button to go to notification center. */}
        {/* Disabled for now as I believe is not the right place */}
        {/* {isAdmin && (
          <Link
            href="/dashboard/notifications/new"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black/80"
          >
            New notification
          </Link>
        )} */}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {TABS.map((t) => {
          const isActive = t.key === activeTab;

          // Preserve `only` in the URL if it’s not the default
          const params = new URLSearchParams();
          params.set("tab", t.key);
          if (only !== "all") params.set("only", only);
          if (page !== 1) params.set("page", String(page));

          const href = `/dashboard/notifications?${params.toString()}`;

          return (
            <Link
              key={t.key}
              href={href}
              className={
                "rounded-full px-3 py-1 text-xs font-medium " +
                (isActive
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200")
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
