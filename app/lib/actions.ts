"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Invoice form data validation schema
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

// Recipe form data validation schema
const RecipeSchema = z.object({
  recipe_name: z.string().min(1, "Recipe name is required"),
  recipe_type: z.enum(["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"]),
  recipe_ingredients: z
    .array(z.string().min(1))
    .min(1, "Enter at least one ingredient"),
  recipe_steps: z.array(z.string().min(1)).min(1, "Enter at least one step"),
});

// Create invoice function
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Invoice creation state/type
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Recipe creation state/type
export type RecipeFormState = {
  message: string | null;
  errors: {
    recipe_name?: string[];
    recipe_type?: string[];
    recipe_ingredients?: string[];
    recipe_steps?: string[];
  };
};

// Authentication verification function
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// Create invoice function
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Delete invoice function
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}

// Delete recipe function
export async function deleteRecipe(id: string) {
  await sql`DELETE FROM recipes WHERE id = ${id}`;
  revalidatePath("/dashboard/recipes");
}

// Still need to create this!
export async function reviewRecipe(id: string) {
  await sql`DELETE FROM recipes WHERE id = ${id}`;
  revalidatePath(`/dashboard/recipes/${id}/review`);
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Update invoice function
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
// Turns a textarea’s newline-separated text into a clean string[] by converting the value to a string, splitting on newlines, trimming each line, and dropping any empty lines.
function splitLinesToArray(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Create recipe function
export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const parsed = RecipeSchema.safeParse({
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: splitLinesToArray(formData.get("recipe_ingredients")),
    recipe_steps: splitLinesToArray(formData.get("recipe_steps")),
  });

  if (!parsed.success) {
    const errors: RecipeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RecipeFormState["errors"];
      (errors[key] ??= []).push(issue.message);
    }
    return { message: "Please correct the errors below.", errors };
  }

  try {
    const { recipe_name, recipe_type, recipe_ingredients, recipe_steps } =
      parsed.data;
    await sql`
      INSERT INTO recipes (recipe_name, recipe_ingredients, recipe_steps, recipe_type)
      VALUES (${recipe_name}, ${recipe_ingredients}, ${recipe_steps}, ${recipe_type})
    `;
  } catch (err) {
    console.error("Create recipe failed:", err);
    return { message: "Failed to create recipe.", errors: {} };
  }

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

// Update schema that includes id
const UpdateRecipeSchema = RecipeSchema.extend({
  id: z.string().uuid("Invalid recipe id"),
});

// Edit recipe function
const splitLines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

export async function updateRecipe(
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const parsed = UpdateRecipeSchema.safeParse({
    id: formData.get("id"),
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: splitLines(formData.get("recipe_ingredients")),
    recipe_steps: splitLines(formData.get("recipe_steps")),
  });

  if (!parsed.success) {
    const errors: RecipeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RecipeFormState["errors"];
      (errors[key] ??= []).push(issue.message);
    }
    // if id fails, it won’t be in RecipeFormState["errors"]; show a top-level message
    if (
      !errors.recipe_name &&
      !errors.recipe_type &&
      !errors.recipe_ingredients &&
      !errors.recipe_steps
    ) {
      return { message: "Invalid recipe id.", errors };
    }
    return { message: "Please correct the errors below.", errors };
  }

  const { id, recipe_name, recipe_type, recipe_ingredients, recipe_steps } =
    parsed.data;

  try {
    await sql`
      UPDATE recipes
      SET
        recipe_name        = ${recipe_name},
        recipe_type        = ${recipe_type}::recipe_type_enum,
        recipe_ingredients = ${recipe_ingredients}::text[],
        recipe_steps       = ${recipe_steps}::text[]
      WHERE id = ${id};
    `;
  } catch (e) {
    console.error("Update recipe failed:", e);
    return {
      message:
        e instanceof Error
          ? `Failed to update recipe: ${e.message}`
          : "Failed to update recipe.",
      errors: {},
    };
  }

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}
