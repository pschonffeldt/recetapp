import EditRecipeForm from "@/app/ui/recipes/edit-recipe-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchRecipeById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Set title for metadata
export const metadata: Metadata = {
  title: "Edit Recipe",
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const recipe = await fetchRecipeById(params.id);
  if (!recipe) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipe" },
          {
            label: "Edit Recipe",
            href: `/dashboard/recipe/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditRecipeForm recipe={recipe} />
    </main>
  );
}
