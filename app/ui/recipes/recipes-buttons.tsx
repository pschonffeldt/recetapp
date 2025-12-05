"use client";

import {
  ArrowDownTrayIcon,
  MagnifyingGlassCircleIcon,
  MinusCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useToast } from "../toast/toast-provider";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { Button } from "../general/button";
import {
  importRecipeFromDiscover,
  importRecipeFromDiscoverInline,
} from "@/app/lib/discover/actions";
import {
  deleteRecipe,
  deleteRecipeFromViewer,
  removeImportedRecipeInline,
  removeRecipeFromLibrary,
} from "@/app/lib/recipes/actions";

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
      <span className="sr-only">View recipe</span>
    </Link>
  );
}

/* ================================
 * Discover view (icon-only link)
 * Keeps unused bind as-is (no behavior change).
 * ================================ */
export function ViewPublicRecipe({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/discover/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
      aria-label="View recipe details"
      title="View recipe details"
    >
      <MagnifyingGlassCircleIcon className="w-5" aria-hidden="true" />
      <span className="sr-only">View recipe</span>
    </Link>
  );
}

/* ================================
 * Discover import (icon-only link)
 * Keeps unused bind as-is (no behavior change).
 * ================================ */
export function ImportRecipeFromDiscover({ id }: { id: string }) {
  const importAction = importRecipeFromDiscover.bind(null, id);

  return (
    <form action={importAction}>
      <Button>Import to my recipes</Button>
    </form>
  );
}

/* =========================================
 * Discover import (icon-only for cards)
 * - Calls inline action (no redirect)
 * - Shows toast feedback
 * ========================================= */
export function ImportRecipeFromDiscoverCard({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const { push } = useToast();

  const handleImport = () => {
    startTransition(async () => {
      try {
        await importRecipeFromDiscoverInline(id);

        push({
          variant: "success",
          title: "Recipe imported",
          message: "The recipe was added to your library.",
        });
      } catch (err) {
        console.error("Failed to import recipe from Discover:", err);
        push({
          variant: "error",
          title: "Import failed",
          message:
            "We couldn’t import this recipe. It might already be in your library.",
        });
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleImport}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50"
      aria-label="Import recipe to my recipes"
      title="Import recipe to my recipes"
    >
      <ArrowDownTrayIcon className="w-5" aria-hidden="true" />
      <span className="sr-only">Import recipe</span>
    </button>
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
  // keep your server action exactly as-is (it will redirect after delete)
  const deleteAction = deleteRecipeFromViewer.bind(null, id);

  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { confirm, push } = useToast();

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const ok = await confirm({
      title: "Delete recipe?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!ok) return;

    // Submit the server action (will redirect to /dashboard/recipes)
    startTransition(() => {
      formRef.current?.requestSubmit();
    });

    // Optional: show a success toast immediately (will still be visible after redirect
    // if your ToastProvider is in the dashboard layout)
    push({
      variant: "success",
      title: "Recipe deleted",
      message: "The recipe was removed.",
      // duration: 4000, // customize if you want
    });
  };

  return (
    <form ref={formRef} action={deleteAction}>
      <button
        type="submit"
        onClick={onClick}
        disabled={isPending}
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
 * Adds toast confirmation
 * ================================ */
export function DeleteRecipe({ id }: { id: string }) {
  const { confirm, push } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete recipe?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!ok) return; // user cancelled

    startTransition(async () => {
      try {
        await deleteRecipe(id); // Server Action
        router.refresh(); // refresh list
        push({
          variant: "success",
          title: "Deleted",
          message: "The recipe was removed successfully.",
        });
      } catch (err) {
        push({
          variant: "error",
          title: "Delete failed",
          message: "We couldn’t delete the recipe. Try again.",
        });
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={isPending}
      className="rounded-md border p-2 hover:bg-red-100 disabled:opacity-60"
      aria-label="Delete recipe"
      title="Delete recipe"
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" aria-hidden="true" />
    </button>
  );
}

/* ================================
 * RemoveImportedRecipe (icon-only)
 * - Used for imported recipes in table/list
 * - Same size as Delete icon button (border + p-2 + w-5 icon)
 * - Calls removeRecipeFromLibrary server action
 * - Confirmation dialog + toast feedback
 * ================================ */

// Remove imported recipes from table
export function RemoveImportedRecipe({ id }: { id: string }) {
  const { confirm, push } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    const ok = await confirm({
      title: "Remove recipe?",
      message:
        "This will remove the imported copy from your library. The original public recipe will still be available in Discover.",
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!ok) return;

    startTransition(async () => {
      try {
        await removeImportedRecipeInline(id);

        push({
          variant: "success",
          title: "Removed",
          message: "Recipe removed from your library.",
        });
      } catch (err) {
        console.error("Failed to remove imported recipe:", err);
        push({
          variant: "error",
          title: "Remove failed",
          message: "We couldn’t remove the recipe. Try again.",
        });
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className="rounded-md border p-2 hover:bg-red-100 disabled:opacity-60"
      aria-label="Remove imported recipe"
      title="Remove imported recipe"
    >
      <span className="sr-only">Remove imported recipe</span>
      <MinusCircleIcon className="w-5" aria-hidden="true" />
    </button>
  );
}

/* ================================
 * Remove imported (viewer context)
 * - Same UX pattern as DeleteRecipeOnViewer
 * - Uses toast.confirm + toast messages
 * - Uses server action via form submit
 * ================================ */
export function RemoveImportedRecipeOnViewer({ id }: { id: string }) {
  const removeAction = removeRecipeFromLibrary.bind(null, id);

  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { confirm, push } = useToast();

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const ok = await confirm({
      title: "Remove from your recipes?",
      message:
        "This will remove the imported copy from your library. The original public recipe will still be available in Discover.",
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!ok) return;

    startTransition(() => {
      formRef.current?.requestSubmit();
    });

    push({
      variant: "success",
      title: "Recipe removed",
      message: "The recipe was removed from your library.",
    });
  };

  return (
    <form ref={formRef} action={removeAction}>
      <button
        type="submit"
        onClick={onClick}
        disabled={isPending}
        className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        aria-label="Remove imported recipe"
        title="Remove imported recipe"
      >
        {isPending ? "Removing…" : "Remove from my recipes"}
      </button>
    </form>
  );
}
