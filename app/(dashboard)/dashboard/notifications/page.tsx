import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";

// Set title for metadata
export const metadata: Metadata = {
  title: "Notifications",
};

export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <h1 className={`${inter.className} mb-4 pl-6 text-xl md:text-2xl`}>
        Notifications
      </h1>
    </main>
  );
}
