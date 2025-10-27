"use client";

import { useActionState } from "react";
import { updateRecipe, type RecipeFormState } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";

const RECIPE_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
] as const;

type Props = {
  recipe: {
    id: string;
    recipe_name: string;
    recipe_type: (typeof RECIPE_TYPES)[number];
    recipe_ingredients: string[];
    recipe_steps: string[];
  };
};

export default function EditRecipeForm({ recipe }: Props) {
  const initial: RecipeFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateRecipe, initial);

  return (
    <form action={formAction}>
      {/* keep the id so the action knows what to update */}
      <input type="hidden" name="id" value={recipe.id} />

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="recipe_name" className="mb-2 block text-sm font-medium">
          Recipe name
        </label>
        <input
          id="recipe_name"
          name="recipe_name"
          type="text"
          defaultValue={recipe.recipe_name}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          aria-describedby="recipe_name-error"
        />
        <div id="recipe_name-error" aria-live="polite" aria-atomic="true">
          {state.errors.recipe_name?.map((e) => (
            <p className="mt-2 text-sm text-red-500" key={e}>
              {e}
            </p>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="mb-4">
        <label htmlFor="recipe_type" className="mb-2 block text-sm font-medium">
          Type
        </label>
        <select
          id="recipe_type"
          name="recipe_type"
          defaultValue={recipe.recipe_type}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          aria-describedby="recipe_type-error"
        >
          {RECIPE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div id="recipe_type-error" aria-live="polite" aria-atomic="true">
          {state.errors.recipe_type?.map((e) => (
            <p className="mt-2 text-sm text-red-500" key={e}>
              {e}
            </p>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <label
          htmlFor="recipe_ingredients"
          className="mb-2 block text-sm font-medium"
        >
          Ingredients (one per line)
        </label>
        <textarea
          id="recipe_ingredients"
          name="recipe_ingredients"
          rows={5}
          defaultValue={recipe.recipe_ingredients.join("\n")}
          className="block w-full rounded-md border border-gray-200 p-2 text-sm"
          aria-describedby="recipe_ingredients-error"
        />
        <div
          id="recipe_ingredients-error"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.errors.recipe_ingredients?.map((e) => (
            <p className="mt-2 text-sm text-red-500" key={e}>
              {e}
            </p>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-4">
        <label
          htmlFor="recipe_steps"
          className="mb-2 block text-sm font-medium"
        >
          Steps (one per line)
        </label>
        <textarea
          id="recipe_steps"
          name="recipe_steps"
          rows={6}
          defaultValue={recipe.recipe_steps.join("\n")}
          className="block w-full rounded-md border border-gray-200 p-2 text-sm"
          aria-describedby="recipe_steps-error"
        />
        <div id="recipe_steps-error" aria-live="polite" aria-atomic="true">
          {state.errors.recipe_steps?.map((e) => (
            <p className="mt-2 text-sm text-red-500" key={e}>
              {e}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit">Save changes</Button>
      </div>

      {state.message && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
