import { clsx } from "clsx";

export default function LanguageBadge({
  language,
}: {
  language: "en" | "es" | null;
}) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium";
  const es = "border-blue-300 bg-blue-50 text-blue-700";
  const en = "border-pink-200 bg-pink-50 text-pink-700";

  return (
    <span className={clsx(base, language === "es" ? es : en)}>
      {language === "es" ? "En" : "Es"}
    </span>
  );
}
