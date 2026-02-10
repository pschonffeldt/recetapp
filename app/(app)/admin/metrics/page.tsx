import { requireAdmin } from "@/app/lib/auth/helpers";
import LatestRecipes from "@/app/ui/dashboard/dashboard-latest-recipes";
import PieChart from "@/app/ui/dashboard/dashboard-pie-chart";
import {
  CardsSkeleton,
  LatestRecipesSkeleton,
} from "@/app/ui/dashboard/dashboard-skeletons";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import CardWrapper from "@/app/ui/general/cards";
import { Suspense } from "react";

export const metadata = {
  title: "User metrics",
};

// This should be gone and we should actually bring data from the users to feed the latest signups and charts
const recipeBreakdown = [
  { label: "Breakfast", value: 12, color: "#3b82f6" },
  { label: "Lunch", value: 8, color: "#10b981" },
  { label: "Dinner", value: 5, color: "#f59e0b" },
  { label: "Dessert", value: 7, color: "#ef4444" },
];

export default async function Page() {
  await requireAdmin({
    callbackUrl: "/admin/metrics",
    redirectTo: "/dashboard",
  });

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin", href: "/admin", clickable: false },
          { label: "Metrics", href: "/admin/metrics", active: true },
        ]}
      />
      {/* KPI Cards section */}
      <div className="rounded-md border-gray-200 bg-gray-50 p-6 shadow-sm">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* This should be changed to latest signups and hteir details
            - Name of the user
            - Country of origin
            - Perhaps some other details like when they registeder
      */}
      <div className="mt-6 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestRecipesSkeleton />}>
          <LatestRecipes />
        </Suspense>
      </div>

      {/* This should be changed to data about the users
            - Country distribution
            - Gender distribution
            - Allergies and dietary flags overview
      */}
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
