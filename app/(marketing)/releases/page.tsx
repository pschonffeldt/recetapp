import { inter } from "@/app/ui/branding/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Releases",
};

export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <h1 className={`${inter.className} mb-4 pl-6 text-xl md:text-2xl`}>
        Releases
      </h1>
    </main>
  );
}
