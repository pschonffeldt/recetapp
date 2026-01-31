import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchRecipeByIdForOwnerOrSaved } from "@/app/lib/recipes/data";

export const metadata: Metadata = { title: "View Recipe" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const userId = await requireUserId();
  const recipe = await fetchRecipeByIdForOwnerOrSaved(id, userId);

  if (!recipe) notFound();

  const mode: "dashboard" | "imported" =
    recipe.user_id === userId ? "dashboard" : "imported";

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/recipes" },
          {
            label: "View Recipe",
            href: `/recipes/${id}/viewer`,
            active: true,
          },
        ]}
      />
      <ViewerRecipe recipe={recipe} mode={mode} />
    </main>
  );
}
