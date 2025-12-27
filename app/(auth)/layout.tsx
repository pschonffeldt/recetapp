import { ToastProvider } from "@/app/ui/toast/toast-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   *  “Purple thingy” controls (edit these)
   * - Opacity:   /10 is VERY subtle, try /20–/35
   * - Size:      h-[520px] w-[520px] → bigger = more visible wash
   * - Position:  keep blobs INSIDE the viewport (avoid huge negative offsets)
   *
   * If you still see *zero* purple:
   * - Replace bg-purple-500 with bg-red-500 to confirm blobs render at all.
   * - If red shows but purple doesn’t, your Tailwind palette/config is the issue.
   */

  return (
    <div className="relative min-h-dvh overflow-hidden bg-white">
      {/* Background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Blue base (keeps your existing vibe) */}
        <div className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-sky-400/18 blur-3xl" />
        <div className="absolute -right-40 bottom-[-220px] h-[640px] w-[640px] rounded-full bg-indigo-500/14 blur-3xl" />

        {/* Purple “thingy” */}
        <div className="absolute -right-24 -top-24 h-[620px] w-[620px] rounded-full bg-purple-500/22 blur-3xl" />
        <div className="absolute -left-28 bottom-[-180px] h-[680px] w-[680px] rounded-full bg-purple-600/16 blur-3xl" />

        {/* Optional extra purple punch */}
        <div className="absolute left-1/2 top-[55%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-purple-400/10 blur-3xl" />

        {/* Soft arc wash */}
        <div className="absolute inset-x-0 bottom-[-260px] h-[520px] rounded-[999px] bg-gradient-to-t from-blue-500/10 via-purple-500/8 to-transparent blur-2xl" />

        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <ToastProvider>
        {/* Centering container for login/signup cards */}
        <main className="relative z-10 flex min-h-dvh items-center justify-center px-4">
          <div className="w-full max-w-[440px]">{children}</div>
        </main>
      </ToastProvider>
    </div>
  );
}
