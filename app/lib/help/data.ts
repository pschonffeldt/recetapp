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
  q?: string
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
  q: string
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
  articleSlug: string
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
