import { APP } from "@/app/lib/utils/app";
import MarketingCTA from "@/app/ui/marketing/sections/cta";
import MarketingFooter from "@/app/ui/marketing/sections/footer";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP.name}`,
    default: APP.name,
  },
  description: APP.description,
  metadataBase: new URL(APP.url),
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <main>{children}</main>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <MarketingCTA />
          <MarketingFooter />
        </div>
      </section>
    </div>
  );
}
