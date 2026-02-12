"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/app/ui/general/button";

type Props = {
  basePath: string;

  // current values (from URL)
  query?: string;
  status?: string; // "" | "open" | "solved"
  topic?: string; // "" | "billing" | "bug" | "feature_request" | "account" | "other"
  hasFilters: boolean;

  contextLabel?: string; // e.g. "support messages"
  totalCount?: number;

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
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ContactInboxFiltersToolbar({
  basePath,
  query = "",
  status = "",
  topic = "",
  hasFilters,
  contextLabel = "support messages",
  totalCount,
  showSearch = true,
  showStatus = true,
  showTopic = true,
}: Props) {
  const router = useRouter();

  const [queryValue, setQueryValue] = useState(query);
  const [statusValue, setStatusValue] = useState(status);
  const [topicValue, setTopicValue] = useState(topic);

  // Keep inputs in sync when navigation updates URL/searchParams
  useEffect(() => setQueryValue(query), [query]);
  useEffect(() => setStatusValue(status), [status]);
  useEffect(() => setTopicValue(topic), [topic]);

  const countText = (() => {
    if (totalCount == null) {
      return hasFilters
        ? `Found results matching your filters`
        : `Showing ${contextLabel}`;
    }
    const label =
      totalCount === 1
        ? contextLabel.replace(/\bmessages\b/i, "message")
        : contextLabel.replace(/\bmessage\b/i, "messages");

    return hasFilters
      ? `Found ${totalCount} ${label}`
      : `Showing ${totalCount} ${label}`;
  })();

  function buildUrl() {
    const sp = new URLSearchParams();

    if (queryValue.trim()) sp.set("query", queryValue.trim());
    if (statusValue) sp.set("status", statusValue);
    if (topicValue) sp.set("topic", topicValue);

    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl());
  }

  function onClear() {
    // Reset UI state
    setQueryValue("");
    setStatusValue("");
    setTopicValue("");

    // Reset URL
    router.push(basePath);
  }

  return (
    <section className="mt-4 rounded-md bg-gray-50 p-4 md:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end"
      >
        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700">
              Search contact messages
            </label>
            <input
              value={queryValue}
              onChange={(e) => setQueryValue(e.target.value)}
              placeholder="Search by subject or username..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {showStatus && (
          <div className="w-full min-w-[140px] md:w-auto">
            <label className="block text-xs font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All status</option>
              <option value="open">Unsolved</option>
              <option value="solved">Solved</option>
            </select>
          </div>
        )}

        {showTopic && (
          <div className="w-full min-w-[160px] md:w-auto">
            <label className="block text-xs font-medium text-gray-700">
              Topic
            </label>
            <select
              value={topicValue}
              onChange={(e) => setTopicValue(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All topics</option>
              <option value="support">Support</option>
              <option value="feedback">Product feedback</option>
              <option value="billing">Billing / pricing</option>
              <option value="bug">Report a bug</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        <div className="flex w-full items-center justify-end gap-2 md:w-auto md:self-end">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      <div className="mt-2 flex min-h-[28px] flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <p>{countText}</p>

        <div
          className={clsx(
            "flex flex-wrap items-center gap-2",
            !hasFilters && "opacity-0 pointer-events-none",
          )}
        >
          {hasFilters ? (
            <>
              {query && <FilterChip label={`Search: "${query}"`} />}
              {status && (
                <FilterChip label={`Status: ${prettyLabel(status)}`} />
              )}
              {topic && <FilterChip label={`Topic: ${prettyLabel(topic)}`} />}

              <Button type="button" onClick={onClear} className="h-8">
                Clear filters
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
