import { inter } from "@/app/ui/branding/branding-fonts";
import { APP } from "@/app/lib/utils/app";

export default function Logo() {
  return (
    <div
      className={`${inter.className} flex flex-row items-center leading-none text-white`}
    >
      <p className="text-[30px]">{APP.name}</p>
    </div>
  );
}
