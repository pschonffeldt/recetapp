import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";

// Set title for metadata
export const metadata: Metadata = {
  title: "Help",
};

export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <Breadcrumbs
        breadcrumbs={[{ label: "Help", href: "/help", active: true }]}
      />
      <div>Tula</div>
    </main>
  );
}
