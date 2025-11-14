import "@/app/ui/global.css";
import { inter } from "@/app/ui/branding/fonts";
import { Metadata } from "next";

// Set title for metadata based on title.template
export const metadata: Metadata = {
  title: {
    template: "%s | RecetApp Dashboard",
    default: "RecetApp Dashboard",
  },
  description: "Cook and shop for your recipes with ease.",
  metadataBase: new URL("https://pschonffeldt.dev/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
