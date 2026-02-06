import { ContactFormCard } from "@/app/ui/marketing/sections/contact-form-card";

export const metadata = {
  title: `Contact`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <ContactFormCard />
    </div>
  );
}
