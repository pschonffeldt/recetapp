import type { ReactNode } from "react";
import type { Metadata } from "next";

import MarketingTopNavBar from "@/app/ui/marketing/home/home-topnav";
import MarketingCTA from "@/app/ui/marketing/home/home-cta";
import MarketingFooter from "@/app/ui/marketing/home/home-footer";

export const metadata: Metadata = {
  title: {
    template: "%s | RecetApp",
    default: "RecetApp",
  },
  description:
    "A calmer way to save recipes, reuse ingredients, and plan meals.",
  metadataBase: new URL("https://pschonffeldt.dev/"),
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingTopNavBar />

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
