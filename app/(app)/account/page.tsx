import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchRecipeLibraryCount, fetchUserById } from "@/app/lib/recipes/data";
import EditAccountMembershipForm from "@/app/ui/account/account-membership-settings";
import EditAccountSettingsForm from "@/app/ui/account/account-settings-form";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Account Settings",
};

export default async function Page() {
  const userId = await requireUserId({ callbackUrl: "/account" });

  const [user, libraryCount] = await Promise.all([
    fetchUserById(userId),
    fetchRecipeLibraryCount(userId),
  ]);
  if (!user) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Account settings",
            href: "/account",
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
