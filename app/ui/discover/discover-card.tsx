import RecipesType from "../recipes/recipes-status";
import RecipesDifficulty from "../recipes/recipes-difficulty";
import { ViewPublicRecipe } from "../recipes/recipes-buttons";
import { formatDateToLocal } from "@/app/lib/utils/format";
import { DiscoverRecipeCard } from "@/app/lib/discover/data";

type Props = {
  recipe: DiscoverRecipeCard;
};

export default function DiscoverCard({ recipe }: Props) {
  const creator = recipe.created_by_display_name ?? "RecetApp cook";

  return (
    <div className="relative rounded-md bg-white shadow-md border p-4 border-gray-100">
      {/* Header row: name + type and difficulty chip */}
      <div className="flex flex-col place-items-start justify-between border-b pb-2 gap-1">
        <p className="font-medium">{recipe.recipe_name}</p>
        <div className="flex items-center justify-between text-gray-500 text-sm gap-2">
          <p>Type:</p>
          <RecipesType type={recipe.recipe_type} />
          <p className="pl-4">Difficulty:</p>
          <RecipesDifficulty type={recipe.difficulty} />
        </div>
      </div>

      {/* Body fields */}
      <div className="mt-3 space-y-2 text-sm text-gray-700">
        {/* Ingredients */}
        <div className="min-h-16">
          <span className="font-medium">Ingredients: </span>
          <span>
            {recipe.recipe_ingredients?.length
              ? (() => {
                  const fullText = recipe.recipe_ingredients.join(", ") + ".";

                  const MAX_CHARS = 100;
                  if (fullText.length <= MAX_CHARS) return fullText;
                  return fullText.slice(0, MAX_CHARS).trimEnd() + "…";
                })()
              : "—"}
          </span>
        </div>
        {/* Date and creator */}
        <div className="flex flex-col gap-1 text-gray-500">
          <div className="flex flex-row">
            <p className="pr-1">Created at -</p>
            <time dateTime={new Date(recipe.recipe_created_at!).toISOString()}>
              {formatDateToLocal(recipe.recipe_created_at!)}
            </time>
          </div>
          <div className="flex flex-row">
            <p className="pr-1">
              Created by: <span className="font-medium">{creator}</span>
            </p>
          </div>
        </div>
        {/* Button to view recipe */}
        <div className="mt-4 flex justify-end gap-2 border-t pt-3">
          <ViewPublicRecipe id={recipe.id} />
        </div>
      </div>
    </div>
  );
}
