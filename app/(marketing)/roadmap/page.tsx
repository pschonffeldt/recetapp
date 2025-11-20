import { inter } from "@/app/ui/branding/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
};

export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <h1 className={`${inter.className} mb-4 pl-6 text-xl md:text-2xl`}>
        Roadmap
      </h1>
    </main>
  );
}
