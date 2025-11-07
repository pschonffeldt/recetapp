// app/(dashboard)/dashboard/toast-playground/page.tsx
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import ToastPlayground from "@/app/ui/toast/toast-playground";

export const dynamic = "force-dynamic";

export default function Page() {
  // guard: only enable if flag is set (so it never shows in prod unless you want)
  if (process.env.NEXT_PUBLIC_ENABLE_TOAST_PLAYGROUND !== "1") {
    return (
      <main className="p-6">
        <p className="text-sm text-gray-600">
          Toast playground is disabled. Set{" "}
          <code className="px-1 py-0.5 bg-gray-100 rounded">
            NEXT_PUBLIC_ENABLE_TOAST_PLAYGROUND=1
          </code>{" "}
          to enable.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <Breadcrumbs
        breadcrumbs={[{ label: "Toast playground", href: "#", active: true }]}
      />
      <ToastPlayground />
    </main>
  );
}
