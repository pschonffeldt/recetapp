"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/app/ui/general/button";

type RoleValue = "" | "user" | "admin";
type TierValue = "" | "free" | "tier1" | "tier2";

type Props = {
  basePath: string;

  query?: string;
  role?: RoleValue;
  tier?: TierValue;
  country?: string;
  language?: string;

  hasFilters: boolean;
  contextLabel?: string;
  totalCount?: number;
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

export default function UsersFiltersToolbar(props: Props) {
  const {
    basePath,
    query,
    role,
    tier,
    country,
    language,
    hasFilters,
    contextLabel = "users",
    totalCount,
  } = props;

  const router = useRouter();

  const [queryValue, setQueryValue] = useState(query ?? "");
  const [roleValue, setRoleValue] = useState<RoleValue>(role ?? "");
  const [tierValue, setTierValue] = useState<TierValue>(tier ?? "");
  const [countryValue, setCountryValue] = useState(country ?? "");
  const [languageValue, setLanguageValue] = useState(language ?? "");

  // Keep inputs in sync when URL/searchParams change
  useEffect(() => setQueryValue(query ?? ""), [query]);
  useEffect(() => setRoleValue((role ?? "") as RoleValue), [role]);
  useEffect(() => setTierValue((tier ?? "") as TierValue), [tier]);
  useEffect(() => setCountryValue(country ?? ""), [country]);
  useEffect(() => setLanguageValue(language ?? ""), [language]);

  const countText = (() => {
    if (totalCount == null) {
      return hasFilters
        ? `Found results matching your filters`
        : `Showing ${contextLabel}`;
    }
    const label =
      totalCount === 1
        ? contextLabel.replace(/\busers\b/i, "user")
        : contextLabel.replace(/\buser\b/i, "users");

    return hasFilters
      ? `Found ${totalCount} ${label}`
      : `Showing ${totalCount} ${label}`;
  })();

  function buildUrl() {
    const sp = new URLSearchParams();

    if (queryValue.trim()) sp.set("query", queryValue.trim());
    if (roleValue) sp.set("role", roleValue);
    if (tierValue) sp.set("tier", tierValue);
    if (countryValue.trim()) sp.set("country", countryValue.trim());
    if (languageValue.trim()) sp.set("language", languageValue.trim());

    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl());
  }

  function onClear() {
    setQueryValue("");
    setRoleValue("");
    setTierValue("");
    setCountryValue("");
    setLanguageValue("");
    router.push(basePath);
  }

  return (
    <section className="mt-4 rounded-md bg-gray-50 p-4 md:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end"
      >
        {/* Search */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-medium text-gray-700">
            Search users
          </label>
          <input
            value={queryValue}
            onChange={(e) => setQueryValue(e.target.value)}
            placeholder="Name, username, email..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <div className="w-full min-w-[140px] md:w-auto">
          <label className="block text-xs font-medium text-gray-700">
            Role
          </label>
          <select
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value as RoleValue)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Tier */}
        <div className="w-full min-w-[160px] md:w-auto">
          <label className="block text-xs font-medium text-gray-700">
            Membership
          </label>
          <select
            value={tierValue}
            onChange={(e) => setTierValue(e.target.value as TierValue)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All tiers</option>
            <option value="free">Free</option>
            <option value="tier1">Tier 1</option>
            <option value="tier2">Tier 2</option>
          </select>
        </div>

        {/* Country */}
        <div className="w-full min-w-[160px] md:w-auto">
          <label className="block text-xs font-medium text-gray-700">
            Country
          </label>
          <input
            value={countryValue}
            onChange={(e) => setCountryValue(e.target.value)}
            placeholder="e.g. Chile"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Language */}
        <div className="w-full min-w-[160px] md:w-auto">
          <label className="block text-xs font-medium text-gray-700">
            Language
          </label>
          <input
            value={languageValue}
            onChange={(e) => setLanguageValue(e.target.value)}
            placeholder='e.g. "en"'
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

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
              {role && <FilterChip label={`Role: ${prettyLabel(role)}`} />}
              {tier && <FilterChip label={`Tier: ${prettyLabel(tier)}`} />}
              {country && <FilterChip label={`Country: ${country}`} />}
              {language && <FilterChip label={`Language: ${language}`} />}

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
