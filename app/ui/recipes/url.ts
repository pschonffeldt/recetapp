export function setParams(
  current: URLSearchParams | Readonly<URLSearchParams>,
  patch: Record<string, string | number | undefined>
) {
  // Clone (Next's URLSearchParams can be read-only)
  const next = new URLSearchParams(current.toString());

  // If any of these change, we should reset pagination:
  // - 'sort' or 'order' (sorting)
  // - 'query' or 'type'  (filters)
  const RESET_KEYS = new Set(["sort", "order", "query", "type"]);

  let touchedResetKey = false;

  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === "") next.delete(k);
    else next.set(k, String(v));

    if (RESET_KEYS.has(k)) touchedResetKey = true;
  }

  // Only reset page if a reset key changed AND caller didn't explicitly set page
  if (touchedResetKey && patch.page === undefined) {
    next.set("page", "1");
  }

  return `?${next.toString()}`;
}
