import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchPublicRecipeById } from "@/app/lib/discover/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "View Recipe" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUserId({ callbackUrl: `/discover/${id}` });

  const recipe = await fetchPublicRecipeById(id);
  if (!recipe) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Discover", href: "/discover" },
          { label: "View Recipe", href: `/discover/${id}`, active: true },
        ]}
      />
      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
