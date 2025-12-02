import { fetchPublicRecipeById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import ViewerRecipe from "@/app/ui/recipes/recipes-viewer";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiscoverRecipePage({ params }: PageProps) {
  const { id } = await params;

  const recipe = await fetchPublicRecipeById(id);

  if (!recipe) {
    notFound();
  }

  // created_by_display_name is selected in the discover query; if it's not
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
        <p className="">
          created by user{" "}
          <span className="text-blue-400 font-bold">{creator}</span>
        </p>
      </div>

      <ViewerRecipe recipe={recipe} mode="discover" />
    </main>
  );
}
