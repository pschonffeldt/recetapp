// app/ui/recipes/recipes-buttons.tsx
import { deleteRecipe, deleteRecipeFromViewer } from "@/app/lib/actions";
import {
  MagnifyingGlassCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

/* 
  NOTE ON A11Y FOR ICON-ONLY CONTROLS
  - Provide a programmatic name with aria-label.
  - Keep the icon decorative via aria-hidden="true".
  - (Optional) Add a matching title to help mouse users with tooltips.
*/

export function CreateRecipe() {
  return (
    <Link
      href="/dashboard/recipes/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      // Visible text already present; aria-label is optional here.
      aria-label="Create recipe"
      title="Create recipe"
    >
      <span className="hidden md:block">Create Recipe</span>{" "}
      <PlusIcon className="h-5 md:ml-4" aria-hidden="true" />
    </Link>
  );
}

export function ViewRecipe({ id }: { id: string }) {
  const deleteRecipeWithId = deleteRecipe.bind(null, id); // (unused but preserved)

  return (
    <Link
      href={`/dashboard/recipes/${id}/viewer`}
      className="rounded-md border p-2 hover:bg-gray-100"
      aria-label="View recipe details"
      title="View recipe details"
    >
      <MagnifyingGlassCircleIcon className="w-5" aria-hidden="true" />
      {/* Redundant, but helpful for some AT; keep if you prefer */}
      <span className="sr-only">View recipe</span>
    </Link>
  );
}

export function UpdateRecipe({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/recipes/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
      aria-label="Edit recipe"
      title="Edit recipe"
    >
      <PencilIcon className="w-5" aria-hidden="true" />
      <span className="sr-only">Edit recipe</span>
    </Link>
  );
}

export function UpdateRecipeOnViewer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/recipes/${id}/edit`}
      className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      aria-label="Edit recipe"
      title="Edit recipe"
    >
      Edit
    </Link>
  );
}

export function DeleteRecipeOnViewer({ id }: { id: string }) {
  const deleteRecipeWithId = deleteRecipeFromViewer.bind(null, id);

  return (
    <form action={deleteRecipeWithId}>
      <button
        type="submit"
        className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        aria-label="Delete recipe"
        title="Delete recipe"
      >
        Delete
      </button>
    </form>
  );
}

export function DeleteRecipe({ id }: { id: string }) {
  const deleteRecipeWithId = deleteRecipe.bind(null, id);

  return (
    <form action={deleteRecipeWithId}>
      <button
        type="submit"
        className="rounded-md border p-2 hover:bg-red-100"
        aria-label="Delete recipe"
        title="Delete recipe"
      >
        {/* Keep sr-only text for AT; icon is decorative */}
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" aria-hidden="true" />
      </button>
    </form>
  );
}
