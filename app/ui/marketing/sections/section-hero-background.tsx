export function SectionHeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Big soft blobs */}
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute -right-52 bottom-[-220px] h-[640px] w-[640px] rounded-full bg-indigo-500/15 blur-3xl" />

      {/* Soft arc wash */}
      <div className="absolute inset-x-0 bottom-[-260px] h-[520px] rounded-[999px] bg-gradient-to-t from-blue-500/10 via-sky-400/5 to-transparent blur-2xl" />

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom fade (smooth transition) */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}
