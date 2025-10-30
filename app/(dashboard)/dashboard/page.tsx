import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestRecipes from "@/app/ui/dashboard/latest-recipes";
import { inter } from "@/app/ui/fonts";
import CardWrapper from "@/app/ui/dashboard/cards";
import { Suspense } from "react";
import {
  LatestRecipesSkeleton,
  CardsSkeleton,
  RevenueChartSkeleton,
} from "@/app/ui/skeletons";
import { Metadata } from "next";
import PieChart from "@/app/ui/dashboard/pie-chart";

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

export default async function Page() {
  return (
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6  gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestRecipesSkeleton />}>
          <LatestRecipes />
        </Suspense>
      </div>
      <div className="mt-6  gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          {/* <RevenueChart /> */}
          <PieChart
            data={recipeBreakdown}
            title="Recipe types breakdown"
            size={180}
            thickness={22}
            showPercent
          />
        </Suspense>
      </div>
    </main>
  );
}
