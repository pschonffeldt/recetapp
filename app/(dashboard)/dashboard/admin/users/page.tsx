import { inter } from "@/app/ui/branding/fonts";

export default async function Page() {
  return (
    <main>
      {/* Page title */}
      <h1 className={`${inter.className} mb-4 pl-6 text-xl md:text-2xl`}>
        Users
      </h1>
    </main>
  );
}
