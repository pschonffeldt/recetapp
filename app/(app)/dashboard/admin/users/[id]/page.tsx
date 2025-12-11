import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { fetchUserById } from "@/app/lib/recipes/data";
import AdminUserEditForm from "@/app/ui/users/users-edit-form";

export const metadata: Metadata = {
  title: "Edit User",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const user = await fetchUserById(id);
  if (!user) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
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
