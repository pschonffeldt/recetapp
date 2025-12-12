import { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import {
  fetchUserById,
  fetchRecipeCountsForUser,
} from "@/app/lib/recipes/data";
import AdminUserEditForm from "@/app/ui/users/users-edit-form";

export const metadata: Metadata = {
  title: "Admin · User",
};

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const session = await auth();

  // Optional: guard so only admins can hit this page
  const sessionRole =
    (session?.user as any)?.user_role || (session?.user as any)?.role;
  if (!session || sessionRole !== "admin") {
    notFound();
  }

  const user = await fetchUserById(params.id);
  if (!user) notFound();

  const { owned, imported } = await fetchRecipeCountsForUser(params.id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Users", href: "/dashboard/admin/users" },
          {
            label: user.user_name || user.email,
            href: `/dashboard/admin/users/${user.id}`,
            active: true,
          },
        ]}
      />

      <AdminUserEditForm
        user={{
          ...user,
          recipes_owned_count: owned,
          recipes_imported_count: imported,
        }}
      />
    </main>
  );
}
