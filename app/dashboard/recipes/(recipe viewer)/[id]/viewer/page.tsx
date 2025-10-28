import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchRecipeById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ViewerRecipe from "@/app/ui/recipes/view-recipe";

// Set title for metadata
export const metadata: Metadata = {
  title: "View Recipe",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await fetchRecipeById(id);
  if (!recipe) notFound();

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
      <ViewerRecipe recipe={recipe} />
    </main>
  );
}
