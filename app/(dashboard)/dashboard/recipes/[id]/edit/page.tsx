// ============================================
// Edit Recipe Page (SSR)
// - Loads a single recipe by id and renders the edit form
// - Displays breadcrumb trail for contextual navigation
// ============================================

/* ================================
 * Imports (grouped by role)
 * ================================ */

// UI
import EditRecipeForm from "@/app/ui/recipes/edit-recipe-form";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";

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
  title: "Edit Recipe",
};

/* ================================
 * Page Component (Server Component)
 * ================================ */
/**
 * Notes:
 * - `params` is typed as a Promise in this codebase; we await it and read `id`.
 *   (In standard App Router, `params` is usually a plain object.)
 * - If no recipe is found for the given id, `notFound()` triggers the 404 boundary.
 * - Data fetching happens here so the form receives a ready `recipe` object.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Resolve dynamic route params
  const { id } = await params;

  // Fetch recipe by id; bail to 404 if not found
  const recipe = await fetchRecipeById(id);
  if (!recipe) notFound();

  // Render breadcrumbs + edit form
  return (
    <main>
      {/* Breadcrumb trail */}
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

      {/* Edit form (receives server-fetched recipe) */}
      <EditRecipeForm recipe={recipe} />
    </main>
  );
}
