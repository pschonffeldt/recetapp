import HelpSearch from "@/app/ui/help/help-search";

export default function HelpHero({
  title = "How can we help?",
  subtitle = "Find answers, guides, and troubleshooting steps.",
  action = "/help",
  defaultValue = "",
}: {
  title?: string;
  subtitle?: string;
  action?: string;
  defaultValue?: string;
}) {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-cyan-500">
      {/* top row */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-6">
        <div className="flex items-center justify-between gap-3 text-white">
          {/* <div className="flex items-center gap-2 text-sm text-white/90">
            <span aria-hidden className="text-base">
              🌐
            </span>
            <span>English</span>
            <span aria-hidden className="ml-1">
              ▾
            </span>
          </div> */}
        </div>
      </div>

      {/* centered hero */}
      <div className="mx-auto w-full max-w-5xl px-4 py-14 md:px-6">
        <div className="flex flex-col items-center text-center text-white">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title} <span aria-hidden>👋</span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-white/90">{subtitle}</p>

          <div className="mt-8 w-full max-w-2xl">
            <HelpSearch action={action} defaultValue={defaultValue} />
          </div>
        </div>
      </div>
    </section>
  );
}
