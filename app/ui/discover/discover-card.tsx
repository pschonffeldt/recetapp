import { DiscoverRecipeCard } from "@/app/lib/data";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "../general/button";
import { capitalizeFirst } from "@/app/lib/utils";
import RecipesType from "../recipes/recipes-status";

type Props = {
  recipe: DiscoverRecipeCard;
};

const difficultyColors = {
  easy: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
} as const;

type DifficultyKey = keyof typeof difficultyColors;

// Reusable chip
function Chip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

export default function DiscoverCard({ recipe }: Props) {
  const creator = recipe.created_by_display_name ?? "RecetApp cook";
  const difficultyKey = (recipe.difficulty ?? "easy") as DifficultyKey;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header and creator */}
      <header className="px-4 py-3">
        <h2 className="line-clamp-2 text-base font-semibold">
          {recipe.recipe_name}
        </h2>
        <p className="mt-1 text-xs">
          by <span className="font-medium">{creator}</span>
        </p>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          <RecipesType type={recipe.recipe_type} />

          <Chip className={clsx("border", difficultyColors[difficultyKey])}>
            {capitalizeFirst(recipe.difficulty ?? "easy")}
          </Chip>

          {recipe.servings && (
            <Chip className="bg-gray-50 text-gray-600">
              {recipe.servings} Servings
            </Chip>
          )}

          {recipe.prep_time_min && (
            <Chip className="bg-gray-50 text-gray-600">
              ~{recipe.prep_time_min} Min
            </Chip>
          )}
        </div>

        {/* Button pinned to bottom */}
        <div className="mt-auto">
          <Link href={`/dashboard/discover/${recipe.id}`}>
            <Button>View recipe</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
