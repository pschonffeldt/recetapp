import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";

// Set title for metadata
export const metadata: Metadata = {
  title: "Support",
};

export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <Breadcrumbs
        breadcrumbs={[
          { label: "Support", href: "/dashboard/support", active: true },
        ]}
      />

      <div>Tula</div>
    </main>
  );
}
