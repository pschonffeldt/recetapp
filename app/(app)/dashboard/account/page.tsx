import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import EditAccountSettingsForm from "@/app/ui/account/account-settings-form";
import EditAccountMembershipForm from "@/app/ui/account/account-membership-settings";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { fetchUserById, fetchRecipeLibraryCount } from "@/app/lib/recipes/data";

export const metadata: Metadata = { title: "Account Settings" };

export default async function Page() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) notFound();

  const [user, libraryCount] = await Promise.all([
    fetchUserById(id),
    fetchRecipeLibraryCount(id),
  ]);
  if (!user) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Account settings",
            href: "/dashboard/account",
            active: true,
          },
        ]}
      />

      <EditAccountMembershipForm user={user} libraryCount={libraryCount} />
      <EditAccountSettingsForm user={user} />
    </main>
  );
}
