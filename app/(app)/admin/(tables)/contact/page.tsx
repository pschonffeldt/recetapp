import { requireAdmin } from "@/app/lib/auth/helpers";
import {
  fetchContactInboxFiltered,
  type ContactInboxFilters,
} from "@/app/lib/contact/contact-data";
import ContactInboxTable from "@/app/ui/contact/admin/contact-inbox-table";
import ContactInboxFiltersToolbar from "@/app/ui/filters/contact-inbox-filters-toolbar";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public inbox",
};

type SearchParams = {
  query?: string;
  status?: "open" | "solved";
  topic?: "support" | "feedback" | "billing" | "bug" | "other";
};

export default async function PublicInboxPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  await requireAdmin({
    callbackUrl: "/admin/contact",
    redirectTo: "/dashboard",
  });

  const raw = props.searchParams ? await props.searchParams : undefined;
  const sp: SearchParams = raw ?? {};

  const query = sp.query ?? "";
  const status = sp.status ?? "";
  const topic = sp.topic ?? "";

  const hasFilters = !!query || !!status || !!topic;

  const filters: ContactInboxFilters = { query, status, topic, limit: 200 };

  const { rows, total } = await fetchContactInboxFiltered(filters);

  return (
    <main className="flex h-full min-h-0 flex-col">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          { label: "Public inbox", href: "/admin/contact", active: true },
        ]}
      />

      <section className="my-10">
        <ContactInboxFiltersToolbar
          basePath="/admin/contact"
          query={query}
          status={status}
          topic={topic}
          hasFilters={hasFilters}
          contextLabel="messages"
          totalCount={total}
          showSearch
          showStatus
          showTopic
        />
      </section>

      <div className="p-4 flex-1 min-h-0 lg:p-0">
        <ContactInboxTable rows={rows} />
      </div>
    </main>
  );
}
