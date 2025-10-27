import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchRecipes } from "@/app/lib/data";
import { Metadata } from "next";
import RecipeForm from "@/app/ui/recipes/create-recipe-form";

// Set title for metadata
export const metadata: Metadata = {
  title: "Create Recipe",
};

export default async function Page() {
  const recipes = await fetchRecipes();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes" },
          {
            label: "Create Recipe",
            href: "/dashboard/invoices/recipes",
            active: true,
          },
        ]}
      />
      <RecipeForm />
    </main>
  );
}
