export type Search = {
  page?: string;
  only?: "all" | "personal" | "broadcasts";
  status?: "any" | "unread" | "read" | "archived";
  tab?: string;
};

export type TabKey =
  | "all"
  | "announcement"
  | "maintenance"
  | "support"
  | "alert"
  | "compliance";

export const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "announcement", label: "Announcement" },
  { key: "maintenance", label: "Maintenance" },
  { key: "support", label: "Support" },
  { key: "alert", label: "Alert" },
  { key: "compliance", label: "Compliance" },
];

// Maps a tab to the filters we pass into fetchNotifications
export function mapTabToFilters(tab: TabKey) {
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
