import { clsx } from "clsx";

export default function CountryBadge({
  country,
}: {
  country: "USA" | "Chile" | "other";
}) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium";
  const usa = "border-red-300 bg-red-50 text-red-700";
  const chile = "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span className={clsx(base, country === "USA" ? usa : chile)}>
      {country === "USA" ? "USA" : "Chile"}
    </span>
  );
}
