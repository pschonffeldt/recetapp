import DiscoverCard from "./discover-card";
import { DiscoverRecipeCard } from "@/app/lib/data";

type Props = {
  recipes: DiscoverRecipeCard[];
};

export default function DiscoverGrid({ recipes }: Props) {
  // If there are no public recipes we show this message
  if (!recipes.length) {
    return (
      <div className="rounded-md border-gray-200 bg-gray-50 p-6">
        <header className="mb-6">
          <p className="mt-2 text-md text-gray-600">
            No public recipes yet. Be the first to publish one!
          </p>
        </header>
      </div>
    );
  }
  // If there are public recipes then we render the following
  return (
    <div id="print" className="rounded-md border-gray-200 bg-gray-50 p-6">
      <header className="mb-6">
        <p className="mt-2 text-md text-gray-600">
          Explore recipes shared by the Recetapp community.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {recipes.map((recipe) => (
          <DiscoverCard recipe={recipe} key={recipe.id} />
        ))}
      </section>
    </div>
  );
}
