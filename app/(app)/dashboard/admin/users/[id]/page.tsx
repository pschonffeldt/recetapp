import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { fetchUserByIdForAdmin } from "@/app/lib/recipes/data";
import AdminUserEditForm from "@/app/ui/users/users-edit-form";
import type { MembershipTier } from "@/app/lib/types/definitions";

export const metadata: Metadata = { title: "Admin – Edit user" };

type PageProps = {
  params: Promise<{ id: string }>;
};

function coerceTier(v: unknown): MembershipTier | null {
  return v === "free" || v === "tier1" || v === "tier2" ? v : null;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const user = await fetchUserByIdForAdmin(id);
  if (!user) notFound();

  const userForForm = {
    ...user,
    membership_tier: coerceTier((user as any).membership_tier),
  };

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
      <AdminUserEditForm user={userForForm} />
    </main>
  );
}
