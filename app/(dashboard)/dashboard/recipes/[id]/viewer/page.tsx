/* ================================
 * Imports (grouped by role)
 * ================================ */

// UI
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/view-recipe";

// Data (DAL)
import { fetchRecipeByIdForOwner } from "@/app/lib/data";

// Framework
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { RecipeForm } from "@/app/lib/definitions";

/* ================================
 * Metadata
 * ================================ */

// Set title for metadata
export const metadata: Metadata = {
  title: "View Recipe",
};

/* ================================
 * Page Component (Server Component)
 * ================================ */

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await fetchRecipeByIdForOwner(params.id);
  if (!recipe) notFound(); // runtime throw; after this you can safely assert

  // Render breadcrumbs + viewer
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes" },
          {
            label: "View Recipe",
            href: `/dashboard/recipes/${params.id}/viewer`, // <-- use params.id
            active: true,
          },
        ]}
      />
      {/* TS: after notFound() we can assert */}
      <ViewerRecipe recipe={recipe as RecipeForm} />
    </main>
  );
}
