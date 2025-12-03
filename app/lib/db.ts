"use server";
import "server-only";
import postgres from "postgres";

/* =============================================================================
 * Database Client
 * =============================================================================
 */

/** Postgres client (uses POSTGRES_URL with SSL required). */

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
