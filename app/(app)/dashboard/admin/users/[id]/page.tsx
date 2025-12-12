import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { fetchUserByIdForAdmin } from "@/app/lib/recipes/data";
import AdminUserEditForm from "@/app/ui/users/users-edit-form";

export const metadata: Metadata = {
  title: "Admin – Edit user",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const user = await fetchUserByIdForAdmin(id);
  if (!user) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Users", href: "/dashboard/admin/users" },
          {
            label: "Edit user",
            href: `/dashboard/admin/users/${id}`,
            active: true,
          },
        ]}
      />
      <AdminUserEditForm user={user} />
    </main>
  );
}
