import "server-only";
import { sql } from "@/app/lib/db";

export type HelpCategory = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon_key: string | null;
  sort_order: number;
};

export type HelpArticleListItem = {
  id: string;
  category_slug: string;
  category_title: string;
  slug: string;
  title: string;
  summary: string | null;
  updated_at: string;
};

export type HelpArticle = HelpArticleListItem & {
  body_md: string;
};

export async function fetchHelpCategories(): Promise<HelpCategory[]> {
  return sql<HelpCategory[]>`
    SELECT id, slug, title, description, icon_key, sort_order
    FROM public.help_categories
    ORDER BY sort_order ASC, title ASC
  `;
}

export async function fetchHelpCategoryBySlug(slug: string) {
  const rows = await sql<HelpCategory[]>`
    SELECT id, slug, title, description, icon_key, sort_order
    FROM public.help_categories
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function fetchHelpArticlesByCategory(
  categoryId: string,
  q?: string,
): Promise<HelpArticleListItem[]> {
  if (!q) {
    return sql<HelpArticleListItem[]>`
      SELECT
        a.id,
        c.slug AS category_slug,
        c.title AS category_title,
        a.slug,
        a.title,
        a.summary,
        a.updated_at
      FROM public.help_articles a
      JOIN public.help_categories c ON c.id = a.category_id
      WHERE a.category_id = ${categoryId}::uuid
        AND a.is_published = true
      ORDER BY a.updated_at DESC
    `;
  }

  return sql<HelpArticleListItem[]>`
    SELECT
      a.id,
      c.slug AS category_slug,
      c.title AS category_title,
      a.slug,
      a.title,
      a.summary,
      a.updated_at
    FROM public.help_articles a
    JOIN public.help_categories c ON c.id = a.category_id
    WHERE a.category_id = ${categoryId}::uuid
      AND a.is_published = true
      AND a.search_tsv @@ websearch_to_tsquery('simple', ${q})
    ORDER BY a.updated_at DESC
  `;
}

export async function searchHelpArticles(
  q: string,
): Promise<HelpArticleListItem[]> {
  return sql<HelpArticleListItem[]>`
    SELECT
      a.id,
      c.slug AS category_slug,
      c.title AS category_title,
      a.slug,
      a.title,
      a.summary,
      a.updated_at
    FROM public.help_articles a
    JOIN public.help_categories c ON c.id = a.category_id
    WHERE a.is_published = true
      AND a.search_tsv @@ websearch_to_tsquery('simple', ${q})
    ORDER BY a.updated_at DESC
    LIMIT 50
  `;
}

export async function fetchHelpArticleBySlugs(
  categorySlug: string,
  articleSlug: string,
) {
  const rows = await sql<HelpArticle[]>`
    SELECT
      a.id,
      c.slug AS category_slug,
      c.title AS category_title,
      a.slug,
      a.title,
      a.summary,
      a.body_md,
      a.updated_at
    FROM public.help_articles a
    JOIN public.help_categories c ON c.id = a.category_id
    WHERE c.slug = ${categorySlug}
      AND a.slug = ${articleSlug}
      AND a.is_published = true
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export const FAQS = [
  {
    id: "do-i-need-an-account",
    category: "getting-started",
    question: "Do I need an account to use RecetApp?",
    answer:
      "Yes. You need an account to use RecetApp and access the app experience (recipes, Discover, shopping list, and support). The public website and Help Center are available without signing in. If you don't have an account yet, you can create one for free.",
  },
  {
    id: "private-vs-public-recipes",
    category: "getting-started",
    question: "What's the difference between private and public recipes?",
    answer:
      "Private recipes are only visible to you when you're signed in. Public recipes can appear in Discover so other users can browse them. Public recipes show your public username (not your email or private account details). You control visibility per recipe.",
  },
  {
    id: "where-to-start",
    category: "getting-started",
    question: "Where do I start if I'm new to RecetApp?",
    answer:
      "Start by creating your first recipe and writing ingredients in a consistent format (amount + unit + ingredient). Once you're comfortable, set a public username if you plan to share recipes and explore Discover for ideas.",
  },
  {
    id: "cant-edit-or-delete-recipe",
    category: "recipes",
    question: "Why can't I edit or delete a recipe?",
    answer:
      "You can always edit and delete recipes you created in your library. If you're not seeing the edit/delete actions, double-check that you're signed in and that you're viewing a recipe you created (not a copied recipe, as copied recipes can't be edited yet).",
  },
  {
    id: "recipe-not-saving-or-showing",
    category: "recipes",
    question: "My recipe isn't saving or isn't showing up, what should I do?",
    answer:
      "First, confirm you're signed in, then refresh the page once. If you were using search or filters, clear them and look again. If it still doesn't appear, try signing out and signing back in. If the issue continues, contact support and include what you tried, what you expected to happen, and what happened instead.",
  },
  {
    id: "best-way-to-write-ingredients",
    category: "ingredients",
    question:
      "What's the best way to write ingredients so RecetApp understands them?",
    answer:
      "Use one ingredient per line and keep a consistent format: amount + unit + ingredient + optional prep. Examples: “2 tbsp olive oil”, “1 onion, diced”, “500 g potatoes”, “1/2 tsp salt”. Avoid vague quantities when possible (e.g., replace “a drizzle” with “1 tbsp”).",
  },
  {
    id: "copy-and-customize-recipe",
    category: "discover",
    question: "Can I copy a recipe and customize it?",
    answer:
      "Right now, copied recipes are saved as a copy you can keep, but editing copied recipes isn't available yet. You can still copy public recipes from Discover to save them to your collection as-is.",
  },
  {
    id: "make-recipe-public-or-private",
    category: "discover",
    question: "How do I make a recipe public (or private again)?",
    answer:
      "Open your recipe and use the visibility control to set it to Public or Private. Public recipes can appear in Discover and show your public username as the creator.",
  },
  {
    id: "public-recipe-not-showing-in-discover",
    category: "discover",
    question: "Why isn't my public recipe showing up in Discover?",
    answer:
      "Make sure the recipe is set to Public and refresh the page once. If you have search terms or filters in Discover, clear them and try again. During early releases, Discover can feel quiet, so it may take a moment to find your recipe through browsing. If it still doesn't show, contact support with the recipe title and your public username.",
  },
  {
    id: "saving-from-discover-changes-original",
    category: "discover",
    question:
      "When I save a recipe from Discover, does it change the original?",
    answer:
      "No. Saving a recipe from Discover does not modify the original recipe. It simply saves a copy to your collection.",
  },
  {
    id: "duplicate-shopping-list-items",
    category: "shopping",
    question: "Why do I see duplicate ingredients in my shopping list?",
    answer:
      "Duplicates usually happen when ingredient lines are written differently, even if they mean the same thing (e.g., “1 onion” vs “onions”, or “olive oil” vs “extra virgin olive oil”). Units can also prevent merging (e.g., “200 g chicken” vs “2 chicken breasts”). Standardizing ingredient wording and units across recipes helps RecetApp merge items cleanly.",
  },
  {
    id: "missing-shopping-list-items",
    category: "shopping",
    question: "Why are some ingredients missing from my shopping list?",
    answer:
      "Confirm the recipe that contains the ingredient was included when generating the list. If the ingredient is marked optional, it may be hidden depending on your list behavior. Also check whether formatting is too vague (e.g., “salt & pepper to taste”) splitting into separate lines can help.",
  },
  {
    id: "optional-items-shopping-list",
    category: "shopping",
    question: "How are optional ingredients handled in the shopping list?",
    answer:
      "Optional ingredients should be marked clearly (e.g., “(optional)”). Depending on your setup, optional items may be included but easy to ignore, or they may be hidden unless you choose to include them. If you're trying to keep the list focused, mark garnish and extras as optional.",
  },
  {
    id: "change-password-rules",
    category: "account",
    question: "How do I change my password (and what are the password rules)?",
    answer:
      "Go to Account Settings and use the Change Password section. To update your password, you need to fill in both password fields, the password must be at least 6 characters, and both entries must match. If you see an error, it's usually because one field was left blank, the password is too short, or the confirmation doesn't match.",
  },
  {
    id: "contact-support-why-login",
    category: "support",
    question: "How do I contact support, and why do I need to be signed in?",
    answer:
      "Use the Contact Support form inside the Help Center. You need to be signed in so support requests can be tied to the correct account and so sensitive account details aren't shared anonymously. When you submit a request, include what you were trying to do, what happened, and any error message you saw.",
  },
] as const;
