import { requireUserId } from "@/app/lib/auth/helpers";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";
import type { RecipeForm } from "@/app/lib/types/definitions";
import { fetchRecipeByIdForOwner } from "@/app/lib/recipes/data";

type ViewerPageProps = {
  params: Promise<{ id: string }>;
};

type RecipeWithOwner = RecipeForm & {
  user_id: string;
};

export default async function Page({ params }: ViewerPageProps) {
  const { id } = await params;

  const userId = await requireUserId();
  const recipe = await fetchRecipeByIdForOwner(id, userId);

  if (!recipe) notFound();

  const recipeWithOwner = recipe as RecipeWithOwner;
  const isOwner = recipeWithOwner.user_id === userId;
  const mode = isOwner ? "dashboard" : "imported";

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes" },
          {
            label: "View Recipe",
            href: `/dashboard/recipes/${id}/viewer`,
            active: true,
          },
        ]}
      />
      <ViewerRecipe recipe={recipe} mode={mode} />
    </main>
  );
}
