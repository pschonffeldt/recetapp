"use client";

import { type RecipeFormState } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import { DeleteRecipeOnViewer, UpdateRecipeOnViewer } from "./recipes-buttons";
import RecipesType from "./recipes-status";
import { brand } from "../branding";
import { RecipeForm } from "@/app/lib/definitions";
import { inter } from "../fonts";
import { MetricCard, MetricCardMobile } from "./recipe-indicators";
import { formatDateToLocal } from "@/app/lib/utils";

// helper (local)
const asDate = (d: string | Date) => (d instanceof Date ? d : new Date(d));

export default function ViewerRecipe({ recipe }: { recipe: RecipeForm }) {
  const initial: RecipeFormState = { message: null, errors: {} };

  async function handleOnClick() {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#print");
    html2pdf(element, {
      margin: 20,
    });
  }

  // Render page
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
          <div className="flex flex-row">
            <p>Created date - </p>
            <time dateTime={new Date(recipe.recipe_created_at!).toISOString()}>
              {formatDateToLocal(recipe.recipe_created_at!)}
            </time>
          </div>
          <div className="flex flex-row">
            <p>Last update - </p>
            <time dateTime={new Date(recipe.recipe_updated_at!).toISOString()}>
              {formatDateToLocal(recipe.recipe_updated_at!)}
            </time>
          </div>
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
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* Chip */}
            <span
              className={`${brand(
                "brand",
                "bg"
              )} inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white`}
            >
              Difficulty
            </span>
            {/* Type chip */}
            <RecipesType type={recipe.difficulty} />
          </div>
        </header>

        {/* Stats mobile*/}
        <section className="mb-6 grid gap-4 sm:grid-cols-4 md:hidden grid-cols-2">
          <MetricCardMobile
            title="Servings"
            value={recipe.servings}
            unit="portions"
            fontClassName={inter.className}
          />

          {/* Prep time */}
          <MetricCardMobile
            title="Prep time"
            value={recipe.prep_time_min}
            unit="min"
            fontClassName={inter.className}
          />

          {/* Recipe calories (total) */}
          <MetricCardMobile
            title="Recipe calories"
            value={recipe.calories_total}
            unit="kcal"
            fontClassName={inter.className}
          />

          {/* Recipe cost (total) */}
          <MetricCardMobile
            title="Recipe cost"
            value={
              recipe.estimated_cost_total
                ? Number(recipe.estimated_cost_total)
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />

          {/* Allergens (0/1 centered, 2+ list) */}
          <MetricCardMobile
            title="Allergens"
            items={recipe.allergens}
            emptyLabel="No allergens."
            fontClassName={inter.className}
          />

          {/* Dietary flags (0/1 centered, 2+ list) */}
          <MetricCardMobile
            title="Dietary flags"
            items={recipe.dietary_flags}
            emptyLabel="No dietary flags."
            fontClassName={inter.className}
          />

          {/* Calories per serving */}
          <MetricCardMobile
            title="Calories / serving"
            value={
              recipe.calories_total != null &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(recipe.calories_total / recipe.servings)
                : null
            }
            unit="kcal"
            fontClassName={inter.className}
          />

          {/* Cost per serving */}
          <MetricCardMobile
            title="Cost / serving"
            value={
              recipe.estimated_cost_total &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(
                    (Number(recipe.estimated_cost_total) / recipe.servings) *
                      100
                  ) / 100
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />
        </section>

        {/* Stats desktop */}
        <section className="hidden md:grid md:grid-cols-4 gap-4 mb-6">
          {/* Servings */}
          <MetricCard
            title="Servings"
            value={recipe.servings}
            unit="portions"
            fontClassName={inter.className}
          />
          {/* Prep time */}
          <MetricCard
            title="Prep time"
            value={recipe.prep_time_min}
            unit="min"
            fontClassName={inter.className}
          />
          {/* Recipe calories (total) */}
          <MetricCard
            title="Recipe calories"
            value={recipe.calories_total}
            unit="kcal"
            fontClassName={inter.className}
          />
          {/* Recipe cost (total) */}
          <MetricCard
            title="Recipe cost"
            value={
              recipe.estimated_cost_total
                ? Number(recipe.estimated_cost_total)
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />
          {/* Allergens (0/1 centered, 2+ list) */}
          <MetricCard
            title="Allergens"
            items={recipe.allergens}
            emptyLabel="No allergens."
            fontClassName={inter.className}
          />
          {/* Dietary flags (0/1 centered, 2+ list) */}
          <MetricCard
            title="Dietary flags"
            items={recipe.dietary_flags}
            emptyLabel="No dietary flags."
            fontClassName={inter.className}
          />
          {/* Calories per serving */}
          <MetricCard
            title="Calories / serving"
            value={
              recipe.calories_total != null &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(recipe.calories_total / recipe.servings)
                : null
            }
            unit="kcal"
            fontClassName={inter.className}
          />
          {/* Cost per serving */}
          <MetricCard
            title="Cost / serving"
            value={
              recipe.estimated_cost_total &&
              recipe.servings &&
              recipe.servings > 0
                ? Math.round(
                    (Number(recipe.estimated_cost_total) / recipe.servings) *
                      100
                  ) / 100
                : null
            }
            unit="S/"
            unitPosition="left"
            fontClassName={inter.className}
          />
        </section>

        {/* Ingredients & Steps */}
        <section className="mb-6 grid gap-3 items-stretch sm:grid-cols-2">
          {/* Left: Ingredients (stretches to natural height) */}
          <MetricCard
            title="Ingredients"
            items={recipe.recipe_ingredients}
            emptyLabel="No ingredients."
            listStyle="disc"
            fontClassName={inter.className}
            className="h-full"
          />

          {/* Right: Steps + Equipment (even heights) */}
          <div className="flex h-full flex-col gap-3">
            <MetricCard
              title="Steps"
              items={recipe.recipe_steps}
              emptyLabel="No steps."
              listStyle="decimal"
              fontClassName={inter.className}
              className="flex-1" // <-- take half
            />
            <MetricCard
              title="Equipment"
              items={recipe.equipment}
              emptyLabel="No equipment."
              listStyle="disc"
              fontClassName={inter.className}
              className="flex-1" // <-- take the other half
            />
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
            Return
          </Link>
          <Button onClick={handleOnClick}>Share</Button>
          <UpdateRecipeOnViewer id={recipe.id} />
          <DeleteRecipeOnViewer id={recipe.id} />
        </div>
      </section>
    </div>
  );
}
