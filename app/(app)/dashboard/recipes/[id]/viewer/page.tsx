import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchRecipeByIdForOwnerOrSaved } from "@/app/lib/recipes/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const userId = await requireUserId();

  const recipe = await fetchRecipeByIdForOwnerOrSaved(id, userId);
  if (!recipe) notFound();

  const isOwner = recipe.user_id === userId;
  const mode: "dashboard" | "imported" = isOwner ? "dashboard" : "imported";

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
