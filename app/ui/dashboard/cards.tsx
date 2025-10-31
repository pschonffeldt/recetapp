import { inter } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
import type { ReactNode } from "react";
import { MetricCard } from "../recipes/recipe-indicators";
import { capitalizeFirst } from "@/app/lib/utils";

export default async function CardWrapper() {
  const {
    totalRecipes,
    avgIngredients,
    mostRecurringCategory,
    totalIngredients,
  } = await fetchCardData();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Most Recurring Category"
        value={capitalizeFirst(mostRecurringCategory)}
        fontClassName={inter.className}
      />
      <MetricCard
        title="Avg. Ingredients / Recipe"
        value={avgIngredients.toFixed(1)}
        unit="ingredients"
        fontClassName={inter.className}
      />
      <MetricCard
        title="Total Recipes"
        value={totalRecipes}
        fontClassName={inter.className}
      />
      <MetricCard
        title="Total Ingredients"
        value={totalIngredients}
        fontClassName={inter.className}
      />
    </div>
  );
}
