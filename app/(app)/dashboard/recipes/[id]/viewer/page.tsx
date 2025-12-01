import { requireUserId } from "@/app/lib/auth-helpers";
import { fetchRecipeByIdForOwner } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const userId = await requireUserId();
  const recipe = await fetchRecipeByIdForOwner(id, userId);

  if (!recipe) notFound();

  const isOwner = recipe.id === userId;
  const mode = isOwner ? "dashboard" : "imported"; // imported = in my library but not mine

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
