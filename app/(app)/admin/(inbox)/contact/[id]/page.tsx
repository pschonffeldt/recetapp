import { requireAdmin } from "@/app/lib/auth/helpers";
import { fetchContactMessageById } from "@/app/lib/contact/contact-data";
import {
  contactCategoryLabel,
  contactCategoryPillClass,
  contactStatusLabel,
  contactStatusPillClass,
} from "@/app/lib/contact/contact-pills";
import { timeAgoFromIso } from "@/app/lib/utils/time";
import ContactInboxMarkSolvedButton from "@/app/ui/contact/admin/contact-inbox-mark-solved-button";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = { title: "Contact message" };

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  await requireAdmin({
    callbackUrl: `/admin/contact/${id}`,
    redirectTo: "/dashboard",
  });

  const msg = await fetchContactMessageById(id);
  if (!msg) notFound();

  const isSolved = msg.status === "solved" || !!msg.solved_at;

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-gray-900">
            {msg.subject}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className={contactCategoryPillClass(msg.category)}>
              {contactCategoryLabel(msg.category)}
            </span>

            <span className={contactStatusPillClass(isSolved)}>
              {contactStatusLabel(isSolved)}
            </span>

            <span className="text-gray-300">•</span>

            <span className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleString()}
            </span>

            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {timeAgoFromIso(msg.created_at)}
            </span>

            {isSolved && msg.solved_at ? (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Solved {timeAgoFromIso(msg.solved_at)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/contact"
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to inbox
          </Link>

          <ContactInboxMarkSolvedButton
            id={msg.id}
            isSolved={isSolved}
            size="md"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Message */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Message</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Full submission (preserves line breaks)
              </p>
            </div>

            <span className={contactCategoryPillClass(msg.category)}>
              {contactCategoryLabel(msg.category)}
            </span>
          </div>

          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {msg.message}
            </p>
          </div>
        </section>

        {/* Contact details */}
        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Contact details
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">Provided by the sender</p>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Identity
              </div>

              <div className="mt-2 grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {msg.contact_name || "—"}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="break-all text-sm font-medium text-gray-900 text-right">
                    {msg.contact_email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Timestamps
              </div>

              <div className="mt-2 grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Updated</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {msg.updated_at
                      ? new Date(msg.updated_at).toLocaleString()
                      : "—"}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-gray-500">Solved</p>
                  <p className="text-sm font-medium text-gray-900 text-right">
                    {msg.solved_at
                      ? new Date(msg.solved_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {msg.solved_by ? (
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Solved by (id)</p>
                <p className="mt-1 break-all text-xs font-medium text-gray-900">
                  {msg.solved_by}
                </p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
