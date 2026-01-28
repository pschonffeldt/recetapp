export default function SoftDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={[
        "mt-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600",
        className,
      ].join(" ")}
    />
  );
}
