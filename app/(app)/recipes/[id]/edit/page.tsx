import { requireUserId } from "@/app/lib/auth/helpers";
import { fetchRecipeByIdForOwner } from "@/app/lib/recipes/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import EditRecipeForm from "@/app/ui/recipes/recipes-edit-form";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Recipe" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const userId = await requireUserId({
    callbackUrl: `/recipes/${id}/edit`,
  });

  const recipe = await fetchRecipeByIdForOwner(id, userId);
  if (!recipe) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/recipes" },
          {
            label: "Edit Recipe",
            href: `/recipes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditRecipeForm recipe={recipe} />
    </main>
  );
}
