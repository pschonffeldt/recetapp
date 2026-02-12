import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchAdminUsers } from "@/app/lib/users/data";
import UsersFiltersToolbar from "@/app/ui/filters/users-filters-toolbar";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import AdminUsersTableView from "@/app/ui/users/users-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User management",
};

type SearchParams = {
  query?: string;
  role?: "admin" | "user" | "";
  tier?: "free" | "tier1" | "tier2" | "";
  country?: string;
  language?: string;
};

export default async function AdminUsersPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  await requireAdmin({
    callbackUrl: "/admin/users",
    redirectTo: "/dashboard",
  });

  const sp = (props.searchParams ? await props.searchParams : {}) ?? {};

  const query = sp.query ?? "";
  const role = (sp.role || null) as "admin" | "user" | null;
  const tier = (sp.tier || null) as "free" | "tier1" | "tier2" | null;
  const country = sp.country?.trim() ? sp.country.trim() : null;
  const language = sp.language?.trim() ? sp.language.trim() : null;

  const { rows: users, total } = await fetchAdminUsers({
    query,
    role,
    tier,
    country,
    language,
  });

  const hasFilters = Boolean(
    query.trim() || role || tier || country || language,
  );

  return (
    <main className="flex h-full min-h-0 flex-col">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          { label: "Users", href: "/admin/users", active: true },
        ]}
      />

      <section className="my-5">
        <UsersFiltersToolbar
          basePath="/admin/users"
          query={query}
          role={role ?? ""}
          tier={tier ?? ""}
          country={country ?? ""}
          language={language ?? ""}
          hasFilters={hasFilters}
          contextLabel="users"
          totalCount={total}
        />
      </section>

      <AdminUsersTableView users={users} />
    </main>
  );
}
