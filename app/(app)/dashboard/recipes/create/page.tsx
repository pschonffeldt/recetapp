import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import RecipeForm from "@/app/ui/recipes/recipes-create-form";
import { Metadata } from "next";

// Set title for metadata
export const metadata: Metadata = {
  title: "Create Recipe",
};

export default async function Page() {
  return (
    <main>
      {/* Breadcrumb trail */}
      <Breadcrumbs
        breadcrumbs={[
          { label: "Recipes", href: "/dashboard/recipes" },
          {
            label: "Create Recipe",
            href: "/dashboard/recipes/create",
            active: true,
          },
        ]}
      />
      {/* Recipe creation form */}
      <RecipeForm />
    </main>
  );
}
