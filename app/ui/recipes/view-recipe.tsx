"use client";

import { type RecipeFormState } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import { DeleteRecipeOnViewer, UpdateRecipeOnViewer } from "./recipes-buttons";
import RecipesType from "./recipes-status";
import { brand } from "../branding";

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

// Render page
export default function ViewerRecipe({ recipe }: Props) {
  const initial: RecipeFormState = { message: null, errors: {} };

  async function handleOnClick() {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#print");
    html2pdf(element, {
      margin: 20,
    });
  }

  return (
    <div>
      <div
        id="print"
        className="rounded-md border-gray-200 bg-gray-50 p-6 shadow-sm"
      >
        {/* Recipe name and type */}
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            {recipe.recipe_name}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* Chip */}
            <span
              className={`${brand(
                "brand",
                "bg"
              )} inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white`}
            >
              Recipe type
            </span>
            {/* Type chip */}
            <RecipesType type={recipe.recipe_type} />
          </div>
        </header>

        {/* Ingredients */}
        <section className="mb-6 grid gap-3 sm:grid-cols-2">
          {/* Ingredients */}
          <div className="rounded-md bg-white border border-gray-200 py-2 px-3 text-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Ingredients
            </h2>
            {recipe.recipe_ingredients?.length ? (
              <ul className="list-disc space-y-1.5 pl-6 text-gray-800">
                {recipe.recipe_ingredients
                  .map((s) => (typeof s === "string" ? s.trim() : s))
                  .filter(Boolean)
                  .map((ing, i) => (
                    <li key={`ing-${i}`}>{ing}</li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No ingredients yet.</p>
            )}
          </div>
          {/* Steps */}
          <div className="rounded-md bg-white border border-gray-200 py-2 px-3 text-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Steps</h2>
            {recipe.recipe_steps?.length ? (
              <ol className="list-decimal space-y-2 pl-6 text-gray-800">
                {recipe.recipe_steps
                  .map((s) => (typeof s === "string" ? s.trim() : s))
                  .filter(Boolean)
                  .map((step, i) => (
                    <li key={`step-${i}`} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-600">No steps yet.</p>
            )}
          </div>
        </section>
      </div>
      {/* Buttons */}
      <section>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/recipes"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Return to list
          </Link>
          <Button onClick={handleOnClick}>Share</Button>
          <UpdateRecipeOnViewer id={recipe.id} />
          <DeleteRecipeOnViewer id={recipe.id} />
        </div>
      </section>
    </div>
  );
}
