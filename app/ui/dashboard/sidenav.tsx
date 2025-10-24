import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import Logo from "@/app/ui/recetapp-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import { brand } from "../branding";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Box containing the logo + link to home when click */}
      <Link
        // Original class, before testing centralized colors
        // className="mb-2 flex h-20 items-end justify-start rounded-md  p-4 md:h-40"

        // Testing centralized colors
        className={`${brand(
          "brand",
          "bg"
        )} mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40`}
        href="/"
      >
        {/* Brand logo */}
        <div className="w-32 text-white md:w-40">
          <Logo />
        </div>
      </Link>
      {/* Box containing everything lower than the logo */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* Navigation buttons */}
        <NavLinks />
        {/* Space between buttons and sign out button */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block">
          {/* Here we will eventually add the Mini-viewer component  */}
        </div>
        {/* Sign out button */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          {/* Button containing icon and text */}
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6 text-red-600" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
