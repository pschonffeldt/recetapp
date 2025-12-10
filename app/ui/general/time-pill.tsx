import clsx from "clsx";

type PrepTimePillProps = {
  minutes: number | null | undefined;
};

export default function PrepTimePill({ minutes }: PrepTimePillProps) {
  // In case there is no time
  if (minutes == null) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600">
        No time
      </span>
    );
  }

  // < 15, < 30, < 60, >= 60
  let timeColor: string;

  if (minutes < 15) {
    // super quick
    timeColor = "bg-emerald-500 text-white";
  } else if (minutes < 30) {
    // quick
    timeColor = "bg-lime-500 text-white";
  } else if (minutes < 60) {
    // medium
    timeColor = "bg-amber-500 text-white";
  } else {
    // long cook
    timeColor = "bg-sky-600 text-white";
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        timeColor
      )}
    >
      {minutes} min
    </span>
  );
}
