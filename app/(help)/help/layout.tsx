import HelpFooter from "@/app/ui/help/help-footer";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">{children}</div>
      <HelpFooter />
    </div>
  );
}
