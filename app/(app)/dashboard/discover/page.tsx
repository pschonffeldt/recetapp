import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { notFound } from "next/navigation";
import { fetchUserById } from "@/app/lib/data";
import { auth } from "@/auth";

export const metadata: Metadata = { title: "Discover" };

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
            label: "Discover",
            href: "/discover",
            active: true,
          },
        ]}
      />
    </main>
  );
}
