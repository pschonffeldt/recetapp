import { fetchPublicRecipeById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

type DiscoverRecipePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiscoverRecipePage({
  params,
}: DiscoverRecipePageProps) {
  const { id } = await params;

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
      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
