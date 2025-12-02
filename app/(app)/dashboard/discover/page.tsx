import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { notFound } from "next/navigation";
import { fetchDiscoverRecipes, fetchUserById } from "@/app/lib/data";
import { auth } from "@/auth";
import DiscoverGrid from "@/app/ui/discover/discover-grid";

export const metadata: Metadata = { title: "Discover" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const recipes = await fetchDiscoverRecipes(userId);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Discover", href: "/dashboard/discover", active: true },
        ]}
      />
      <DiscoverGrid recipes={recipes} />
    </main>
  );
}
