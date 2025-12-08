export const toInt = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : null;
};

export const toMoney = (v: FormDataEntryValue | null): number | null => {
  if (v == null) return null;

  const raw = String(v).trim();
  if (!raw) return null;

  // Allow both "9,00" and "9.00"
  const normalized = raw.replace(",", ".");

  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;

  return n;
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
