import { fetchPublicRecipeById } from "@/app/lib/data";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiscoverRecipePage({ params }: PageProps) {
  const { id } = await params;

  const recipe = await fetchPublicRecipeById(id);

  if (!recipe) {
    notFound();
  }

  // created_by_display_name is selected in the discover query; if it's not
  // on the TS type, this cast keeps the compiler happy.
  const creator = (recipe as any).created_by_display_name ?? "Recetapp cook";

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

      {/* Reuse your existing viewer in discover mode */}
      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
