import { fetchRecipeLibraryCount, fetchUserById } from "@/app/lib/recipes/data";
import EditAccountMembershipForm from "@/app/ui/account/account-membership-settings";
import EditAccountSettingsForm from "@/app/ui/account/account-settings-form";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Account Settings",
};

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
      {/* Membership form */}
      <EditAccountMembershipForm user={user} libraryCount={libraryCount} />
      {/* User information form */}
      <EditAccountSettingsForm user={user} />
    </main>
  );
}
