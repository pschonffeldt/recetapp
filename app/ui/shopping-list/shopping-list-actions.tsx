"use client";

import { ShoppingListRecipe } from "@/app/lib/recipes/data";
import { APP } from "@/app/lib/utils/app";
import { Button } from "@/app/ui/general/button";
import { useToast } from "@/app/ui/toast/toast-provider";
import { useMemo, useState } from "react";

type Props = {
  recipes: ShoppingListRecipe[];
  selectedIds: string[]; // currently applied selection (from URL / server)
  lines: string[]; // aggregated + formatted items from the server
};

export default function ShoppingListActions({
  recipes,
  selectedIds,
  lines,
}: Props) {
  const { push } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const hasList = selectedIds.length > 0 && lines.length > 0;

  const appliedRecipes = useMemo(
    () => recipes.filter((r) => selectedIds.includes(r.id)),
    [recipes, selectedIds],
  );

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard API not available");
      push({
        variant: "error",
        message: "Clipboard is not available in this browser.",
      });
      return;
    }

    // Recipes that are currently applied (from the URL / server)
    const appliedIds = selectedIds ?? [];
    const appliedRecipes = recipes.filter((r) => appliedIds.includes(r.id));

    const recipeLines =
      appliedRecipes.length > 0
        ? appliedRecipes.map((r) => `- ${r.recipe_name}`)
        : [];

    const ingredientLines =
      lines.length > 0 ? lines.map((line) => `- ${line}`) : [];

    const sections: string[] = [];
    sections.push("Shopping list");

    if (recipeLines.length > 0) {
      sections.push("\nRecipes:\n" + recipeLines.join("\n"));
    }

    if (ingredientLines.length > 0) {
      sections.push("\nIngredients:\n" + ingredientLines.join("\n"));
    }

    // Footer with brand + URL from constants
    sections.push("", `Generated with ${APP.legalName}`, `Try it: ${APP.url}`);

    const text = sections.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      push({
        variant: "success",
        message: "Shopping list copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy shopping list:", err);
      push({
        variant: "error",
        message: "Could not copy shopping list. Please try again.",
      });
    }
  };

  const handleExportPdf = async () => {
    if (!hasList) return;

    setIsExporting(true);
    try {
      const { default: html2pdf } = await import("html2pdf.js");

      const recipeListHtml =
        appliedRecipes.length > 0
          ? `<ul>${appliedRecipes
              .map((r) => `<li>${r.recipe_name}</li>`)
              .join("")}</ul>`
          : "<p>(no specific recipes selected)</p>";

      const ingredientsListHtml =
        lines.length > 0
          ? `<ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>`
          : "<p>(no ingredients)</p>";

      const html = `
        <div style="
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 12px;
          line-height: 1.5;
        ">
          <h1 style="font-size: 18px; margin-bottom: 8px;">Shopping list</h1>

          <h2 style="font-size: 14px; margin: 12px 0 4px;">Recipes</h2>
          ${recipeListHtml}

          <h2 style="font-size: 14px; margin: 12px 0 4px;">Ingredients</h2>
          ${ingredientsListHtml}

          <p style="margin-top: 16px; font-size: 11px; color: #555;">
            Generated with ${APP.legalName} · <a href="${APP.url}">${APP.url}</a>
          </p>
        </div>
      `;

      await html2pdf()
        .from(html)
        .set({
          margin: 10,
          filename: `${APP.legalName.toLowerCase().replace(/\s+/g, "-")}-shopping-list.pdf`,
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();

      push({
        variant: "success",
        message: "Shopping list exported as PDF.",
      });
    } catch (err) {
      console.error("Failed to export shopping list PDF:", err);
      push({
        variant: "error",
        message: "Could not export PDF. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-2 sm:flex sm:items-center sm:gap-2 sm:space-y-0">
      <Button
        type="button"
        onClick={handleCopy}
        disabled={!hasList || isExporting}
        className="w-full rounded-md bg-blue-500 px-3 py-2.5 text-sm text-white hover:bg-blue-400 disabled:opacity-50 sm:w-auto"
      >
        Copy list
      </Button>

      <Button
        type="button"
        onClick={handleExportPdf}
        disabled={!hasList || isExporting}
        className="w-full rounded-md bg-blue-500 px-3 py-2.5 text-sm text-white hover:bg-blue-400 disabled:opacity-50 sm:w-auto"
      >
        {isExporting ? "Exporting…" : "Export PDF"}
      </Button>
    </div>
  );
}
