// app/ui/discover/discover-grid.tsx (or similar)
import Link from "next/link";
import DiscoverCard from "./discover-card";
import { DiscoverRecipeCard } from "@/app/lib/data";

type Props = {
  recipes: DiscoverRecipeCard[];
};

export default function DiscoverGrid({ recipes }: Props) {
  if (!recipes.length) {
    return (
      <p className="text-sm text-gray-600">
        No public recipes yet. Be the first to publish one!
      </p>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Link key={recipe.id} href={`/dashboard/discover/${recipe.id}`}>
          <DiscoverCard recipe={recipe} />
        </Link>
      ))}
    </section>
  );
}
