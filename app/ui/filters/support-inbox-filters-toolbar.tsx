"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Button } from "../general/button";

type Props = {
  basePath: string;

  // Current values (read from searchParams and passed in)
  query?: string;
  status?: "" | "open" | "solved" | string;
  topic?: string;

  hasFilters: boolean;

  // UX / text
  contextLabel?: string; // e.g. "messages"
  totalCount?: number;

  // Feature flags
  showSearch?: boolean;
  showStatus?: boolean;
  showTopic?: boolean;
};

function FilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 shadow-sm">
      {label}
    </span>
  );
}

function prettyLabel(value: string) {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function prettyStatus(value: string) {
  if (!value) return "";
  if (value === "open") return "Unsolved";
  if (value === "solved") return "Solved";
  return prettyLabel(value);
}

export default function SupportInboxFiltersToolbar(props: Props) {
  const {
    basePath,
    query = "",
    status = "",
    topic = "",
    hasFilters,
    contextLabel = "messages",
    totalCount,
    showSearch = true,
    showStatus = true,
    showTopic = true,
  } = props;

  const router = useRouter();

  const countText = (() => {
    if (totalCount == null) {
      return hasFilters
        ? "Found results matching your filters"
        : `Showing ${contextLabel}`;
    }

    const label = totalCount === 1 ? "message" : "messages";
    return hasFilters
      ? `Found ${totalCount} ${label}`
      : `Showing ${totalCount} ${label}`;
  })();

  return (
    <section className="mt-4 rounded-md bg-gray-50 p-4 md:p-6">
      <form
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end"
        method="get"
        action={basePath}
      >
        {/* Search */}
        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="support-query"
              className="block text-xs font-medium text-gray-700"
            >
              Search support messages
            </label>
            <input
              id="support-query"
              name="query"
              type="text"
              defaultValue={query}
              placeholder="Search by subject, username, or email..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Status */}
        {showStatus && (
          <div className="w-full min-w-[160px] md:w-auto">
            <label
              htmlFor="support-status"
              className="block text-xs font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="support-status"
              name="status"
              defaultValue={status}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All status</option>
              <option value="open">Unsolved</option>
              <option value="solved">Solved</option>
            </select>
          </div>
        )}

        {/* Topic */}
        {showTopic && (
          <div className="w-full min-w-[180px] md:w-auto">
            <label
              htmlFor="support-topic"
              className="block text-xs font-medium text-gray-700"
            >
              Topic
            </label>
            <select
              id="support-topic"
              name="topic"
              defaultValue={topic}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All topics</option>
              {/* Adjust these values to EXACTLY match sr.category values */}
              <option value="billing">Billing</option>
              <option value="feature_request">Feature request</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-end">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      {/* Summary + chips */}
      <div className="mt-2 flex min-h-[28px] flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <p>{countText}</p>

        <div
          className={clsx(
            "flex flex-wrap items-center gap-2",
            !hasFilters && "pointer-events-none opacity-0",
          )}
        >
          {hasFilters ? (
            <>
              {query ? <FilterChip label={`Search: "${query}"`} /> : null}
              {status ? (
                <FilterChip label={`Status: ${prettyStatus(status)}`} />
              ) : null}
              {topic ? (
                <FilterChip label={`Topic: ${prettyLabel(topic)}`} />
              ) : null}

              <Button
                type="button"
                onClick={() => router.push(basePath)}
                className="h-8"
              >
                Clear filters
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
