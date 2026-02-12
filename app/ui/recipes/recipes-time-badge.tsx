import { Badge, BadgeMuted } from "../users/badge";

type PrepTimePillProps = {
  minutes: number | null | undefined;
};

export default function PrepTimePill({ minutes }: PrepTimePillProps) {
  if (minutes == null) return <BadgeMuted>No time</BadgeMuted>;

  const cls =
    minutes < 15
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : minutes < 30
        ? "border-lime-200 bg-lime-50 text-lime-700"
        : minutes < 60
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-sky-200 bg-sky-50 text-sky-700";

  return <Badge className={cls}>{minutes} min</Badge>;
}
