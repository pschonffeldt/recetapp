import { requireUserId } from "@/app/lib/auth/helpers";
import LatestRecipes from "@/app/ui/dashboard/dashboard-latest-recipes";
import {
  CardsSkeleton,
  LatestRecipesSkeleton,
} from "@/app/ui/dashboard/dashboard-skeletons";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import CardWrapper from "@/app/ui/general/cards";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  await requireUserId({ callbackUrl: "/dashboard" });
  return (
    <main>
      {/* Page title */}
      <Breadcrumbs
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard", active: true }]}
      />

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
    </main>
  );
}
