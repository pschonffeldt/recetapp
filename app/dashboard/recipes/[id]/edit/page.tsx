// import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
// import { fetchRecipeById, fetchRecipes } from "@/app/lib/data";
// import { notFound } from "next/navigation";
// import { Metadata } from "next";
// import EditRecipeForm from "@/app/ui/recipes/edit-recipe-form";

// export const metadata: Metadata = {
//   title: "Edit Recipe",
// };

// export default async function Page(props: { params: Promise<{ id: string }> }) {
//   const params = await props.params;
//   const id = params.id;
//   const [invoice, customers] = await Promise.all([
//     fetchRecipeById(id),
//     fetchRecipes(),
//   ]);
//   if (!invoice) {
//     notFound();
//   }
//   return (
//     <main>
//       <Breadcrumbs
//         breadcrumbs={[
//           { label: "Recipes", href: "/dashboard/recipe" },
//           {
//             label: "Edit Recipe",
//             href: `/dashboard/recipe/${id}/edit`,
//             active: true,
//           },
//         ]}
//       />
//       <EditRecipeForm recipe={recipe} />
//     </main>
//   );
// }

// app/dashboard/recipes/[id]/edit/page.tsx
import { fetchRecipeById } from "@/app/lib/data";
import EditRecipeForm from "@/app/ui/recipes/edit-recipe-form";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await fetchRecipeById(params.id);
  if (!recipe) notFound();

  return <EditRecipeForm recipe={recipe} />;
}
