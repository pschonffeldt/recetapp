export function Wave({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="0 0 500 140"
        preserveAspectRatio="none"
        className={`block h-[95px] w-full md:h-[130px] ${
          flip ? "rotate-180" : ""
        }`}
      >
        <path
          d="M0,64 C240,140 520,0 760,48 C1010,98 1220,140 1440,72 L1440,140 L0,140 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function SparklesOverlay() {
  const dots = Array.from({ length: 32 }).map((_, i) => i);
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      aria-hidden
    >
      {dots.map((i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/70"
          style={{
            left: `${(i * 31) % 100}%`,
            top: `${(i * 19) % 100}%`,
            transform: `scale(${0.5 + ((i * 11) % 12) / 10})`,
          }}
        />
      ))}
      <span className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
      <span className="absolute left-[72%] top-[32%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
      <span className="absolute left-[42%] top-[74%] h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
    </div>
  );
}

export function AppMock({
  label,
  wide = true,
}: {
  label: string;
  wide?: boolean;
}) {
  // Always enforce consistent width + prevent narrow shrink in grid layouts
  return (
    <div
      className={[
        "w-full",
        wide ? "max-w-[560px]" : "max-w-[460px]",
        "rounded-2xl border bg-white shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <div className="ml-2 text-xs text-gray-500">{label}</div>
      </div>
      <div className="p-4 md:p-6">
        <div className="h-60 w-full rounded-xl bg-gray-100 md:h-72" />
      </div>
    </div>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-6">
      <div className="text-[2.25rem] font-semibold leading-none tracking-tight text-gray-900">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-700">{label}</p>
    </div>
  );
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-200/90">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
