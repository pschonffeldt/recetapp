import { Badge } from "./badge";

type CountryValue = "USA" | "Chile" | "other";

function normalizeCountry(input?: string | null): CountryValue {
  const c = (input ?? "").trim().toLowerCase();
  if (c === "usa" || c === "us" || c === "united states") return "USA";
  if (c === "chile" || c === "cl") return "Chile";
  return "other";
}

export default function CountryBadge({ country }: { country?: string | null }) {
  const value = normalizeCountry(country);

  const cls =
    value === "USA"
      ? "border-red-300 bg-red-50 text-red-700"
      : value === "Chile"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-gray-50 text-gray-700";

  const label = value === "other" ? "Other" : value;

  return <Badge className={cls}>{label}</Badge>;
}
