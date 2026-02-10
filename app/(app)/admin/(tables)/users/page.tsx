import { requireAdmin } from "@/app/lib/auth/helpers";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import AdminUsersTable from "@/app/ui/users/users-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User management",
};

export default async function AdminUsersPage() {
  await requireAdmin({
    callbackUrl: "/admin/users",
    redirectTo: "/dashboard",
  });

  return (
    <main className="flex h-full min-h-0 flex-col">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          { label: "Users", href: "/admin/users", active: true },
        ]}
      />
      <AdminUsersTable />
    </main>
  );
}
