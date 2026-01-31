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
  const recipe = await fetchPublicRecipeById(id);

  if (!recipe) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Discover", href: "/dashboard/discover" },
          {
            label: "View Recipe",
            href: `/dashboard/discover/${id}`,
            active: true,
          },
        ]}
      />
      {/* mode='discover' so the chip shows */}
      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
