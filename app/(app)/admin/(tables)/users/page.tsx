import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchAdminUsers } from "@/app/lib/users/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import AdminUsersTableView from "@/app/ui/users/users-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User management",
};

export default async function AdminUsersTable() {
  await requireAdmin({
    callbackUrl: "/admin/users",
    redirectTo: "/dashboard",
  });
  const users = await fetchAdminUsers();

  return (
    <main className="flex h-full min-h-0 flex-col">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          { label: "Users", href: "/admin/users", active: true },
        ]}
      />
      <AdminUsersTableView users={users} />
    </main>
  );
}
