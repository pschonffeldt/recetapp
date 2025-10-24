// import { BookOpenIcon } from "@heroicons/react/24/outline";
import { inter } from "@/app/ui/fonts";

export default function Logo() {
  return (
    <div
      className={`${inter.className} flex flex-row items-center leading-none text-white`}
    >
      {/* <BookOpenIcon className="h-12 w-12 rotate-[15deg]" /> */}
      <p className="text-[44px]">RecetApp</p>
    </div>
  );
}
