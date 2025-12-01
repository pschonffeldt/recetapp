import { DiscoverRecipeCard } from "@/app/lib/data";
import clsx from "clsx";

type Props = {
  recipe: DiscoverRecipeCard;
};

// Define the map without tying it to the DiscoverRecipeCard type
const difficultyColors = {
  easy: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
} as const;

type DifficultyKey = keyof typeof difficultyColors;

export default function DiscoverCard({ recipe }: Props) {
  const creator = recipe.created_by_display_name ?? "Recetapp cook";

  // Fallback to "easy" if difficulty is undefined/null
  const difficultyKey = (recipe.difficulty ?? "easy") as DifficultyKey;

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="mb-2">
        <h2 className="line-clamp-2 text-base font-semibold">
          {recipe.recipe_name}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          by <span className="font-medium">{creator}</span>
        </p>
      </header>

      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
          {recipe.recipe_type}
        </span>

        <span
          className={clsx(
            "rounded-full border px-2 py-0.5 text-xs font-medium",
            difficultyColors[difficultyKey]
          )}
        >
          {recipe.difficulty ?? "easy"}
        </span>

        {recipe.servings && (
          <span className="rounded-full bg-gray-50 px-2 py-0.5 text-gray-600">
            {recipe.servings} servings
          </span>
        )}

        {recipe.prep_time_min && (
          <span className="rounded-full bg-gray-50 px-2 py-0.5 text-gray-600">
            ~{recipe.prep_time_min} min
          </span>
        )}
      </div>
    </article>
  );
}
