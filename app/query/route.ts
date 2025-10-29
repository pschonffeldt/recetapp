import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function listRecipes() {
  const data = await sql`
    SELECT recipes.amount, recipe.id
    FROM recipes
    WHERE invoices.amount = 666;
  `;

  return data;
}

export async function GET() {
  try {
    return Response.json(await listRecipes());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
