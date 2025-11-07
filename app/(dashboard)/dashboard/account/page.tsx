import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import EditAccountSettingsForm from "@/app/ui/account/edit-account-settings-form";
import { notFound } from "next/navigation";
import { fetchUserById } from "@/app/lib/data";
import { auth } from "@/auth";

export const metadata: Metadata = { title: "Account Settings" };

export default async function Page() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) notFound();

  const user = await fetchUserById(id);
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
      <EditAccountSettingsForm user={user} />
    </main>
  );
}
