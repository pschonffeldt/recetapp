import clsx from "clsx";

type PrepTimePillProps = {
  minutes: number | null | undefined;
};

export default function PrepTimePill({ minutes }: PrepTimePillProps) {
  if (minutes == null) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600">
        No time
      </span>
    );
  }

  // Simple buckets like difficulty-style colors
  const cls =
    minutes <= 15
      ? "bg-emerald-500 text-white"
      : minutes <= 45
      ? "bg-amber-500 text-white"
      : "bg-sky-600 text-white";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        cls
      )}
    >
      {minutes} min
    </span>
  );
}
