import EditRecipeForm from "@/app/ui/recipes/edit-recipe-form";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import { fetchRecipeByIdForOwner } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Recipe" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await fetchRecipeByIdForOwner(id);
  if (!recipe) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes" },
          {
            label: "Edit Recipe",
            href: `/dashboard/recipes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditRecipeForm recipe={recipe} />
    </main>
  );
}
