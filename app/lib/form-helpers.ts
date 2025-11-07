export const toInt = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : null;
};
export const toMoney = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "")
    .replace(/,/g, "")
    .trim();
  return s === "" ? null : s;
};
export const toLines = (v: FormDataEntryValue | null) => {
  const arr = String(v ?? "")
    .split(/\r?\n|,/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(arr));
};
export const str = (v: unknown) =>
  typeof v === "string" ? v.trim() : undefined;
