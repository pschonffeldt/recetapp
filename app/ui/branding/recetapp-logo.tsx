import { inter } from "@/app/ui/branding/fonts";

export default function Logo() {
  return (
    <div
      className={`${inter.className} flex flex-row items-center leading-none text-white`}
    >
      <p className="text-[30px]">RecetApp</p>
    </div>
  );
}
