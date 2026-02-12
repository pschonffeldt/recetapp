import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchSupportInbox } from "@/app/lib/support/admin-data";
import SupportInboxFiltersToolbar from "@/app/ui/filters/support-inbox-filters-toolbar";
import SupportFiltersToolbar from "@/app/ui/filters/support-inbox-filters-toolbar";
import UsersFiltersToolbar from "@/app/ui/filters/users-filters-toolbar";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import SupportInboxTable from "@/app/ui/support/admin/support-inbox-table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support inbox" };

type SearchParams = {
  query?: string;
  status?: "open" | "solved";
  topic?: string;
};

export default async function SupportInboxPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  await requireAdmin({
    callbackUrl: "/admin/support",
    redirectTo: "/dashboard",
  });

  const sp = (await props.searchParams) ?? {};
  const query = sp.query?.trim() ?? "";
  const status = sp.status ?? "";
  const topic = sp.topic?.trim() ?? "";

  const hasFilters = !!query || !!status || !!topic;

  const { rows, totalCount } = await fetchSupportInbox({
    query: query || null,
    status: (status || null) as any,
    topic: topic || null,
  });

  return (
    <main className="flex h-full min-h-0 flex-col">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          { label: "Support inbox", href: "/admin/support", active: true },
        ]}
      />

      <section className="my-5">
        <SupportInboxFiltersToolbar
          basePath="/admin/support"
          query={query}
          status={status}
          topic={topic}
          hasFilters={hasFilters}
          contextLabel="support messages"
          totalCount={totalCount}
        />
      </section>

      <div className="flex-1 min-h-0">
        <SupportInboxTable rows={rows} />
      </div>
    </main>
  );
}
