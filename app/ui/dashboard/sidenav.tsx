import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import Logo from "@/app/ui/recetapp-logo";
import { brand } from "../branding";

export default function SideNav() {
  return (
    // <div className="flex h-full flex-col px-3 py-4 md:px-2">
    <div className="flex h-full flex-col px-3 py-4 lg:px-2">
      {/* Box containing the logo + link to home when click */}
      <Link
        className={`${brand(
          "brand",
          "bg"
        )} mb-2 flex h-20 items-end justify-start rounded-md p-4 lg:h-40`}
        href="/"
      >
        {/* Brand logo */}
        {/* <div className="w-32 text-white md:w-40"> */}
        <div className="w-32 text-white lg:w-40">
          <Logo />
        </div>
      </Link>
      {/* Box containing everything lower than the logo */}
      {/* <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2"> */}
      <div className="flex grow flex-row justify-between space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
        {/* Navigation buttons */}
        <NavLinks />
        {/* Space between buttons and sign out button */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 lg:block">
          {/* Here we will eventually add the Mini-viewer component  */}
        </div>
      </div>
    </div>
  );
}
