"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/app/ui/button";
import { createRecipe, RecipeFormState } from "@/app/lib/actions";

// Dropdown of meal type:
const RECIPE_TYPES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
] as const;

export default function RecipeForm() {
  const initialState: RecipeFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createRecipe, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Recipe name */}
        <div className="mb-4">
          <label
            htmlFor="recipe_name"
            className="mb-2 block text-sm font-medium"
          >
            Recipe name
          </label>
          <div className="relative">
            <input
              id="recipe_name"
              name="recipe_name"
              type="text"
              placeholder="e.g., Sandwich de palta"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="recipe_name-error"
            />
            {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
          </div>
          <div id="recipe_name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.recipe_name?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="mb-4">
          <label
            htmlFor="recipe_type"
            className="mb-2 block text-sm font-medium"
          >
            Type
          </label>
          <select
            id="recipe_type"
            name="recipe_type"
            defaultValue=""
            className="block w-full cursor-pointer rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            aria-describedby="recipe_type-error"
          >
            <option value="" disabled>
              Select a type
            </option>
            {RECIPE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div id="recipe_type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.recipe_type?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Ingredients (one per line) */}
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
            placeholder={"Pan\nPalta\nSal"}
            className="block w-full rounded-md border border-gray-200 p-2 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="recipe_ingredients-error"
          />
          <div
            id="recipe_ingredients-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.recipe_ingredients?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Steps (one per line) */}
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
            placeholder={
              "Cortar pan\nTostar pan\nMoler palta\nAgregar sal a gusto\nPoner palta en pan"
            }
            className="block w-full rounded-md border border-gray-200 p-2 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="recipe_steps-error"
          />
          <div id="recipe_steps-error" aria-live="polite" aria-atomic="true">
            {state.errors?.recipe_steps?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/recipes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Discard
        </Link>
        <Button type="submit">Create Recipe</Button>
      </div>

      {/* Top-level form error */}
      {state.message && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
