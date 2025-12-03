import { inter } from "@/app/ui/branding/branding-fonts";
import { fetchCardData } from "@/app/lib/data";
import { MetricCard, MetricCardMobile } from "../recipes/recipes-indicators";
import { capitalizeFirst } from "@/app/lib/utils/format";

export default async function CardWrapper() {
  const {
    totalRecipes,
    avgIngredients,
    mostRecurringCategory,
    totalIngredients,
  } = await fetchCardData();

  return (
    <div>
      {/* Desktop indicators */}
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"> */}
      <div className="hidden md:grid md:grid-cols-4 gap-6">
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
      {/* Mobile indicators */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4 md:hidden grid-cols-2">
        <MetricCardMobile
          title="Most Recurring Category"
          value={capitalizeFirst(mostRecurringCategory)}
          fontClassName={inter.className}
        />
        <MetricCardMobile
          title="Avg. Ingredients / Recipe"
          value={avgIngredients.toFixed(1)}
          unit="ingredients"
          fontClassName={inter.className}
        />
        <MetricCardMobile
          title="Total Recipes"
          value={totalRecipes}
          fontClassName={inter.className}
        />
        <MetricCardMobile
          title="Total Ingredients"
          value={totalIngredients}
          fontClassName={inter.className}
        />
      </div>
    </div>
  );
}
