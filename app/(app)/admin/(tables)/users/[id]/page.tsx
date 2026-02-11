import { requireAdmin } from "@/app/lib/auth/helpers";
import type { MembershipTier } from "@/app/lib/types/definitions";
import { fetchUserByIdForAdmin } from "@/app/lib/users/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import AdminUserEditForm from "@/app/ui/users/users-edit-form";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit user" };

type PageProps = {
  params: Promise<{ id: string }>;
};

function coerceTier(v: unknown): MembershipTier | undefined {
  return v === "free" || v === "tier1" || v === "tier2" ? v : undefined;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  await requireAdmin({
    callbackUrl: `/admin/users/${id}`,
    redirectTo: "/dashboard",
  });

  const user = await fetchUserByIdForAdmin(id);
  if (!user) notFound();

  const userForForm = {
    ...user,
    membership_tier: coerceTier((user as any).membership_tier) ?? "free",
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          { label: "Users", href: "/admin/users" },
          { label: "Edit user", href: `/admin/users/${id}`, active: true },
        ]}
      />

      <AdminUserEditForm user={userForForm} />
    </main>
  );
}
