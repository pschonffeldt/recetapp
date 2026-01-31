import { fetchUserById } from "@/app/lib/recipes/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import AdminUsersTable from "@/app/ui/users/users-table";
import { auth } from "@/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "User management",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) notFound();

  const me = await fetchUserById(id);
  // Only allow admins to see this page
  if (!me || (me as any).user_role !== "admin") {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Users", href: "/dashboard/admin/users", active: true },
        ]}
      />
      <AdminUsersTable />
    </main>
  );
}
