/* =============================================================================
 * Marketing — Release Notes & Roadmap
 * =============================================================================
 * - Release notes list
 * - Roadmap grouped by status (planned / in_progress / shipped)
 * =============================================================================
 */

"use server";

import "server-only";

import { sql } from "../db";

/* =============================================================================
 * Types
 * =============================================================================
 */

export type ReleaseNote = {
  id: string;
  title: string;
  body: string;
  releasedAt: string;
};

export type RoadmapStatus = "planned" | "in_progress" | "shipped";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string | null;
  status: RoadmapStatus;
  orderIndex: number | null;
};

export type RoadmapGrouped = {
  planned: RoadmapItem[];
  inProgress: RoadmapItem[];
  shipped: RoadmapItem[];
};

/**
 * Fetch all release notes, newest first.
 * Used by the /release-notes page.
 */
export async function fetchReleaseNotes(): Promise<ReleaseNote[]> {
  const rows = await sql<
    {
      id: string;
      title: string;
      body: string;
      released_at: string;
    }[]
  >/* sql */ `
    SELECT id, title, body, released_at
    FROM public.release_notes
    ORDER BY released_at DESC, created_at DESC
  `;

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    releasedAt: r.released_at,
  }));
}

/**
 * Fetch roadmap items and group them by status:
 * - planned
 * - in_progress
 * - shipped
 *
 * Items are ordered by (status, order_index, created_at).
 */
export async function fetchRoadmapGrouped(): Promise<RoadmapGrouped> {
  const rows = await sql<
    {
      id: string;
      title: string;
      description: string | null;
      status: RoadmapStatus;
      order_index: number | null;
    }[]
  >/* sql */ `
    SELECT id, title, description, status, order_index
    FROM public.roadmap_items
    ORDER BY created_at DESC
  `;

  const planned: RoadmapItem[] = [];
  const inProgress: RoadmapItem[] = [];
  const shipped: RoadmapItem[] = [];

  for (const r of rows) {
    const item: RoadmapItem = {
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      orderIndex: r.order_index ?? 0,
    };

    if (r.status === "planned") planned.push(item);
    else if (r.status === "in_progress") inProgress.push(item);
    else shipped.push(item);
  }

  return { planned, inProgress, shipped };
}
