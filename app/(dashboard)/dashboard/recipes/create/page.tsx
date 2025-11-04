// ============================================
// Create Recipe Page (SSR)
// - Shows breadcrumb trail and the recipe creation form
// - No data fetching needed here (form handles its own needs)
// ============================================

/* ================================
 * Imports (grouped by role)
 * ================================ */

// UI
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import RecipeForm from "@/app/ui/recipes/create-recipe-form";

// Framework
import { Metadata } from "next";

/* ================================
 * Metadata
 * ================================ */

// Set title for metadata
export const metadata: Metadata = {
  title: "Create Recipe",
};

/* ================================
 * Page Component (Server Component)
 * ================================ */
/**
 * Renders:
 *  - Breadcrumb navigation for context
 *  - Recipe creation form
 */
export default async function Page() {
  return (
    <main>
      {/* Breadcrumb trail */}
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes" },
          {
            label: "Create Recipe",
            href: "/dashboard/recipes/create",
            active: true,
          },
        ]}
      />

      {/* Recipe creation form */}
      <RecipeForm />
    </main>
  );
}
