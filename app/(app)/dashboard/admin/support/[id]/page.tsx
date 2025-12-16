import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { fetchSupportMessageById } from "@/app/lib/support/admin-data";
import Link from "next/link";
import { capitalizeFirst } from "@/app/lib/utils/format";
import { timeAgoFromIso } from "@/app/lib/utils/time";
import {
  supportCategoryLabel,
  supportCategoryPillClass,
  supportStatusLabel,
  supportStatusPillClass,
} from "@/app/lib/support/pills";
import MarkSolvedButton from "@/app/ui/support/admin/mark-solved-button";

export const metadata = { title: "Admin – Support message" };

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const session = await auth();
  const role = (session?.user as any)?.user_role;

  if (!session?.user) redirect("/login");
  if (role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const msg = await fetchSupportMessageById(id);
  if (!msg) notFound();

  const isSolved = !!msg.solved_at;

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-gray-900">
              {msg.subject}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className={supportCategoryPillClass(msg.category)}>
                {supportCategoryLabel(msg.category)}
              </span>

              <span className={supportStatusPillClass(isSolved)}>
                {supportStatusLabel(isSolved)}
              </span>

              <span className="text-gray-300">•</span>

              <span className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleString()}
              </span>

              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {timeAgoFromIso(msg.created_at)}
              </span>

              {isSolved && msg.solved_at && (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Solved {timeAgoFromIso(msg.solved_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admin/support"
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to inbox
          </Link>

          <MarkSolvedButton id={msg.id} isSolved={isSolved} size="md" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Message */}
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Message</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Full user submission (preserves line breaks)
              </p>
            </div>

            {/* Category pill  */}
            {msg.category ? (
              <span className={supportCategoryPillClass(msg.category)}>
                {supportCategoryLabel(msg.category)}
              </span>
            ) : null}
          </div>

          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {msg.message}
            </p>
          </div>
        </section>

        {/* User details */}
        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                User details
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Snapshot at time of request
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                Tier: {capitalizeFirst(msg.membership_tier ?? "free")}
              </span>
              <span
                className={[
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                  (msg.user_role ?? "user") === "admin"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-gray-200 bg-gray-50 text-gray-700",
                ].join(" ")}
              >
                {(msg.user_role ?? "user") === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* Identity */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Identity
              </div>
              <div className="mt-2 grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {[msg.name, msg.last_name].filter(Boolean).join(" ") || "—"}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">User name</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {msg.user_name ?? "—"}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 text-right break-all">
                    {msg.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Country</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {msg.country ?? "—"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Language</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {capitalizeFirst(msg.language ?? "—")}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Gender</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {capitalizeFirst(msg.gender ?? "—")}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Date of birth</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {msg.date_of_birth ? msg.date_of_birth.slice(0, 10) : "—"}
                </p>
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-lg border border-gray-100 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Activity
              </div>
              <div className="mt-2 grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {msg.created_user_at
                      ? new Date(msg.created_user_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Last login</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {msg.last_login_at
                      ? new Date(msg.last_login_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-800 text-right">{value}</dd>
    </div>
  );
}
