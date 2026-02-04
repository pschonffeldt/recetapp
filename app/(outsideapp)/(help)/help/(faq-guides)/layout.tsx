import { APP } from "@/app/lib/utils/app";
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
    <div className="min-h-min bg-white">
      <main>{children}</main>
    </div>
  );
}
