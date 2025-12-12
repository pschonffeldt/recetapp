import Breadcrumbs from "@/app/ui/general/breadcrumbs";

export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Help",
            href: "/dashboard/help",
            active: true,
          },
        ]}
      />
      <div className="rounded-md border-gray-200 bg-gray-50 p-6 shadow-sm">
        Tula
      </div>
    </main>
  );
}
