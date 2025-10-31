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
  title: "User Settings",
};

export default async function Page() {
  return (
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
        User settings
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"></div>
      <div className="mt-6  gap-6 md:grid-cols-4 lg:grid-cols-8"></div>
      <div className="mt-6  gap-6 md:grid-cols-4 lg:grid-cols-8"></div>
    </main>
  );
}
