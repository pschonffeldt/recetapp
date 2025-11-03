export function setParams(
  current: URLSearchParams,
  patch: Record<string, string | undefined>
) {
  const next = new URLSearchParams(current);
  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === "") next.delete(k);
    else next.set(k, String(v));
  }
  // whenever filters/sort change, go back to page 1
  next.delete("page");
  return `?${next.toString()}`;
}
