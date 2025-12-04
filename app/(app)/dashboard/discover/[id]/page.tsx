import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { fetchPublicRecipeById } from "@/app/lib/discover/data";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Discover recipe",
};

export default async function DiscoverRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 15 style: params is a Promise
  const { id } = await params;

  const recipe = await fetchPublicRecipeById(id);

  if (!recipe) {
    notFound();
  }

  // created_by_display_name is selected in the query; if it's not
  // on the TS type, this cast keeps the compiler happy.
  const creator = (recipe as any).created_by_display_name ?? "Recetapp cook";

  return (
    <main>
      <div className="flex items-baseline gap-2">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Discover", href: "/dashboard/discover" },
            {
              label: "Public Recipe",
              href: `/dashboard/discover/${id}`,
              active: true,
            },
          ]}
        />
        <p>
          created by user{" "}
          <span className="font-bold text-blue-400">{creator}</span>
        </p>
      </div>

      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
