export function minutesToAgo(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return "";

  if (minutes < 60) {
    const m = Math.floor(minutes);
    return `${m} min ago`;
  }

  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }

  const d = Math.floor(minutes / 1440);
  return `${d} day${d === 1 ? "" : "s"} ago`;
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
