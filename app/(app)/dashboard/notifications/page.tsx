import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import NotificationsList from "@/app/ui/notifications/notifications-list";
import { fetchNotifications } from "@/app/lib/notifications/data";

export const metadata: Metadata = { title: "Notifications" };

type Search = {
  page?: string;
  only?: "all" | "personal" | "broadcasts";
  status?: "any" | "unread" | "read" | "archived";
  tab?: string;
};

/* =============================================================================
 * Filter
 * =============================================================================
 */

// Tabs we show in the UI
type TabKey =
  | "all"
  | "announcement"
  | "maintenance"
  | "support"
  | "alert"
  | "compliance";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "announcement", label: "Announcement" },
  { key: "maintenance", label: "Maintenance" },
  { key: "support", label: "Support" },
  { key: "alert", label: "Alert" },
  { key: "compliance", label: "Compliance" },
];

// Maps a tab to the filters we pass into fetchNotifications
function mapTabToFilters(tab: TabKey) {
  switch (tab) {
    case "announcement":
      return { status: "any" as const, kind: "announcement" as const };
    case "maintenance":
      return { status: "any" as const, kind: "maintenance" as const };
    case "support":
      return { status: "any" as const, kind: "support" as const };
    case "alert":
      return { status: "any" as const, kind: "alert" as const };
    case "compliance":
      return { status: "any" as const, kind: "compliance" as const };
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
  const awaitedSearchParams = await searchParams;

  const page = Math.max(1, Number(awaitedSearchParams?.page ?? 1));
  const only = (awaitedSearchParams?.only ?? "all") as NonNullable<
    Search["only"]
  >;

  // Decide active tab
  const tabParam = awaitedSearchParams?.tab as TabKey | undefined;
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

  function buildTabHref(tab: TabKey, only: NonNullable<Search["only"]>) {
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (only !== "all") params.set("only", only);

    // UX: when switching tabs, reset pagination
    // (don’t include `page` here)
    return `/dashboard/notifications?${params.toString()}`;
  }

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
      <div className="mt-3">
        {/* Mobile: dropdown */}
        <div className="sm:hidden px-4 pb-4">
          <details className="group rounded-md border border-gray-200 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-gray-900">
              <span>
                Filter:{" "}
                <span className="font-semibold">
                  {TABS.find((t) => t.key === activeTab)?.label ?? "All"}
                </span>
              </span>
              <span className="text-gray-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>

            <div className="border-t border-gray-100 p-2 mb-6">
              <div className="grid gap-1">
                {TABS.map((t) => {
                  const isActive = t.key === activeTab;
                  return (
                    <Link
                      key={t.key}
                      href={buildTabHref(t.key, only)}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "rounded-md px-3 py-2 text-sm",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {t.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </details>
        </div>

        {/* Desktop: nicer pill tabs (and still scrolls if it ever overflows) */}
        <nav
          className="pb-4 hidden sm:block"
          aria-label="Notification categories"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => {
              const isActive = t.key === activeTab;
              return (
                <Link
                  key={t.key}
                  href={buildTabHref(t.key, only)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </nav>
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
