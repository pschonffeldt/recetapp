export function minutesToAgo(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m ago`;
  return `${h}h ${m}m ago`;
}

export function minutesSince(iso: string) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;

  const mins = Math.max(0, Math.floor((Date.now() - t) / 60_000));
  return mins;
}

export function timeAgoFromIso(iso: string) {
  const mins = minutesSince(iso);
  if (mins === null) return "—";
  if (mins === 0) return "just now";
  return minutesToAgo(mins);
}
