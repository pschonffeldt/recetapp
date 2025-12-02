import { fetchPublicRecipeById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

type DiscoverRecipePageProps = {
  params: { id: string };
};

export default async function DiscoverRecipePage({
  params,
}: DiscoverRecipePageProps) {
  const { id } = params;

  const recipe = await fetchPublicRecipeById(id);
  if (!recipe) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Discover", href: "/dashboard/discover" },
          {
            label: "View public recipe",
            href: `/dashboard/discover/${id}`,
            active: true,
          },
        ]}
      />

      {/* Re-use the main recipe viewer in discover mode */}
      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
