import { fetchPublicRecipeById } from "@/app/lib/data";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

type PageProps = {
  params: { id: string };
};

export default async function DiscoverRecipePage({ params }: PageProps) {
  const recipe = await fetchPublicRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  const creator = recipe.created_by_display_name ?? "Recetapp cook";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Discover recipe
        </p>
        <p className="mt-1 text-sm text-gray-600">
          by <span className="font-medium">{creator}</span>
        </p>
      </header>

      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
