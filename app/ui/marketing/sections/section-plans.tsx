import { Plan, PlanCard } from "./plan-card";

type SectionPlansProps = {
  plans: Plan[];
  className?: string;
};

export function SectionPlans({ plans, className }: SectionPlansProps) {
  return (
    <section
      className={[
        "mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28",
        className ?? "",
      ].join(" ")}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={p.title} {...p} />
        ))}
      </div>
    </section>
  );
}
