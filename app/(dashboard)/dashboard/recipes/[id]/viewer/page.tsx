// ============================================
// View Recipe Page (SSR)
// - Fetches a single recipe by id and renders a read-only viewer
// - Shows breadcrumb trail for navigation
// ============================================

/* ================================
 * Imports (grouped by role)
 * ================================ */

// UI
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/view-recipe";

// Data (DAL)
import { fetchRecipeById } from "@/app/lib/data";

// Framework
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
/**
 * Notes:
 * - `params` is typed as a Promise in this codebase; we await it and destructure `id`.
 *   (In standard App Router, `params` is usually a plain object.)
 * - If the recipe is not found, we call `notFound()` to render the 404 boundary.
 * - Data fetching lives here (server component) so the Viewer receives ready-to-render data.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Resolve dynamic route params (id)
  const { id } = await params;

  // Fetch the recipe; bail out to 404 if it doesn't exist
  const recipe = await fetchRecipeById(id);
  if (!recipe) notFound();

  // Render breadcrumbs + viewer
  return (
    <main>
      {/* Breadcrumb trail for contextual navigation */}
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

      {/* Read-only recipe viewer */}
      <ViewerRecipe recipe={recipe} />
    </main>
  );
}
