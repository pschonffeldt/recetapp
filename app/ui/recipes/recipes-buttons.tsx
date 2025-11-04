// ============================================
// Recipe Action Buttons (Client UI fragments)
// - Icon-only controls with accessible labels
// - Keep public API: CreateRecipe, ViewRecipe, UpdateRecipe,
//   UpdateRecipeOnViewer, DeleteRecipeOnViewer, DeleteRecipe
// ============================================

/* ================================
 * Imports (grouped by role)
 * ================================ */
import { deleteRecipe, deleteRecipeFromViewer } from "@/app/lib/actions";
import {
  MagnifyingGlassCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

/* ================================
 * A11y notes for icon-only controls
 * ================================
 * - Provide a programmatic name via aria-label.
 * - Mark icons as decorative with aria-hidden="true".
 * - Optional title attribute for mouse users (tooltip).
 * - Buttons/links keep native keyboard semantics.
 */

/* ================================
 * Create (link button)
 * Visible text → aria-label is optional, kept for consistency.
 * ================================ */
export function CreateRecipe() {
  return (
    <Link
      href="/dashboard/recipes/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      aria-label="Create recipe"
      title="Create recipe"
    >
      <span className="hidden md:block">Create Recipe</span>{" "}
      <PlusIcon className="h-5 md:ml-4" aria-hidden="true" />
    </Link>
  );
}

/* ================================
 * View (icon-only link)
 * Keeps unused bind as-is (no behavior change).
 * ================================ */
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
      {/* Redundant for some AT; safe to keep */}
      <span className="sr-only">View recipe</span>
    </Link>
  );
}

/* ================================
 * Edit (icon-only link)
 * ================================ */
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

/* ================================
 * Edit (viewer context — text button)
 * Uses visible text; aria-label keeps naming consistent.
 * ================================ */
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

/* ================================
 * Delete (viewer context — form submit)
 * Server Action form retained as-is.
 * ================================ */
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

/* ================================
 * Delete (icon-only button in table/list)
 * Retains form + server action; adds clear accessible name.
 * ================================ */
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
        {/* Programmatic name for AT; icon is decorative */}
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" aria-hidden="true" />
      </button>
    </form>
  );
}
