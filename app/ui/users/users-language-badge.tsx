import { Badge } from "./badge";

type LanguageValue = "en" | "es" | "other";

function normalizeLanguage(input?: string | null): LanguageValue {
  const l = (input ?? "").trim().toLowerCase();
  if (l === "en" || l === "english") return "en";
  if (l === "es" || l === "spanish" || l === "español") return "es";
  return "other";
}

export default function LanguageBadge({
  language,
}: {
  language?: string | null;
}) {
  const value = normalizeLanguage(language);

  const cls =
    value === "es"
      ? "border-blue-300 bg-blue-50 text-blue-700"
      : value === "en"
        ? "border-pink-200 bg-pink-50 text-pink-700"
        : "border-gray-200 bg-gray-50 text-gray-700";

  const label = value === "es" ? "ES" : value === "en" ? "EN" : "Other";

  return <Badge className={cls}>{label}</Badge>;
}
