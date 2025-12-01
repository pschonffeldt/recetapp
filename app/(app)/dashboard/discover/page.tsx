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
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Discover public recipes
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Explore recipes shared by the Recetapp community.
        </p>
      </header>

      <DiscoverGrid recipes={recipes} />
    </main>
  );
}
