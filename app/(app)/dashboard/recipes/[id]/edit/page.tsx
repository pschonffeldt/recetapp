import EditRecipeForm from "@/app/ui/recipes/recipes-edit-form";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { fetchRecipeByIdForOwner } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { requireUserId } from "@/app/lib/auth/helpers";

export const metadata: Metadata = { title: "Edit Recipe" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const userId = await requireUserId();
  const recipe = await fetchRecipeByIdForOwner(id, userId);

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
