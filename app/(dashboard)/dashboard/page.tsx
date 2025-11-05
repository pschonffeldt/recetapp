// ============================================
// Dashboard Page (SSR)
// - Shows KPI cards, latest recipes, and charts
// - Uses Suspense boundaries with skeleton fallbacks
// ============================================

/* ================================
 * Imports (grouped by type)
 * ================================ */

// UI blocks
import LatestRecipes from "@/app/ui/dashboard/latest-recipes";
import CardWrapper from "@/app/ui/dashboard/cards";
import PieChart from "@/app/ui/dashboard/pie-chart";

// Fonts & framework primitives
import { inter } from "@/app/ui/fonts";
import { Suspense } from "react";
import { Metadata } from "next";

// Skeletons (fallback UI for Suspense)
import { LatestRecipesSkeleton, CardsSkeleton } from "@/app/ui/skeletons";

/* ================================
 * Metadata
 * ================================ */

// Set title for metadata
export const metadata: Metadata = {
  title: "Dashboard",
};

/* ================================
 * Local demo data (static)
 * ================================ */
/**
 * Static example dataset for the PieChart demo.
 * NOTE: This is intentionally hardcoded. Replace with live data when available:
 *   - e.g., fetch from a server action or a DAL function that returns {label, value}
 */
const recipeBreakdown = [
  { label: "Breakfast", value: 12, color: "#3b82f6" },
  { label: "Lunch", value: 8, color: "#10b981" },
  { label: "Dinner", value: 5, color: "#f59e0b" },
  { label: "Dessert", value: 7, color: "#ef4444" },
];

/* ================================
 * Page Component (Server Component)
 * ================================ */
/**
 * Renders:
 *  - KPI Cards (CardWrapper) with Suspense + CardsSkeleton
 *  - LatestRecipes list with Suspense + LatestRecipesSkeleton
 *  - Two PieChart instances using the same static dataset (demo layout)
 *
 * Notes:
 *  - This component is async to allow future server data needs.
 *  - Suspense boundaries keep the UX responsive while data loads.
 *  - Keep grid/spacing consistent with Tailwind utility classes below.
 */
export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <h1 className={`${inter.className} mb-4 pl-6 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {/* KPI Cards section */}
      {/* Wrapper provides rounded border + subtle background */}
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"> */}
      <div className="rounded-md border-gray-200 bg-gray-50 p-6 shadow-sm">
        {/* Suspense boundary for the cards; shows skeleton while CardWrapper loads */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* Latest Recipes section */}
      {/* Grid classes commented out above can be re-enabled when layout changes */}
      <div className="mt-6 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Suspense boundary for the latest recipes; shows skeleton while fetching */}
        <Suspense fallback={<LatestRecipesSkeleton />}>
          <LatestRecipes />
        </Suspense>
      </div>

      {/* Demo chart grid (two identical PieCharts side-by-side on md+) */}
      {/* Each chart uses the same static dataset above; replace with live data when ready */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg">
          {" "}
          <PieChart
            data={recipeBreakdown}
            title="Recipe types breakdown"
            size={180}
            thickness={22}
            showPercent
          />
        </div>
        <div className="rounded-lg">
          {" "}
          <PieChart
            data={recipeBreakdown}
            title="Recipe types breakdown"
            size={180}
            thickness={22}
            showPercent
          />
        </div>
      </div>
    </main>
  );
}
