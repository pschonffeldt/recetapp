import LatestRecipes from "@/app/ui/dashboard/dashboard-latest-recipes";
import CardWrapper from "@/app/ui/general/cards";
import PieChart from "@/app/ui/dashboard/dashboard-pie-chart";
import { inter } from "@/app/ui/branding/branding-fonts";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  LatestRecipesSkeleton,
  CardsSkeleton,
} from "@/app/ui/dashboard/dashboard-skeletons";

// Set title for metadata
export const metadata: Metadata = {
  title: "Dashboard",
};

const recipeBreakdown = [
  { label: "Breakfast", value: 12, color: "#3b82f6" },
  { label: "Lunch", value: 8, color: "#10b981" },
  { label: "Dinner", value: 5, color: "#f59e0b" },
  { label: "Dessert", value: 7, color: "#ef4444" },
];

type DashboardSearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function Page(_props: {
  searchParams?: Promise<DashboardSearchParams>;
}) {
  return (
    <main>
      {/* Page title */}
      <h1 className={`${inter.className} mb-4 pl-6 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {/* KPI Cards section */}
      <div className="rounded-md border-gray-200 bg-gray-50 p-6 shadow-sm">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* Latest Recipes section */}
      <div className="mt-6 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestRecipesSkeleton />}>
          <LatestRecipes />
        </Suspense>
      </div>

      {/* Each chart uses the same static dataset for now, gotta find a cool use for this :) */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg">
          <PieChart
            data={recipeBreakdown}
            title="Recipe types breakdown"
            size={180}
            thickness={22}
            showPercent
          />
        </div>
        <div className="rounded-lg">
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
