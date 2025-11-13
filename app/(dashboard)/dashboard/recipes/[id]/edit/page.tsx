import { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import EditRecipeForm from "@/app/ui/recipes/edit-recipe-form";

import { fetchRecipeByIdForOwner } from "@/app/lib/data";
import type { RecipeForm } from "@/app/lib/definitions";

export const metadata: Metadata = { title: "Edit Recipe" };

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await fetchRecipeByIdForOwner(params.id);
  if (!recipe) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes" },
          {
            label: "Edit Recipe",
            href: `/dashboard/recipes/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <EditRecipeForm recipe={recipe as RecipeForm} />
    </main>
  );
}
