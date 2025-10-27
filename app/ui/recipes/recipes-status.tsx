import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function RecipesType({ type }: { type: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-blue-500 text-white": type === "breakfast",
          "bg-green-500 text-white": type === "lunch",
          "bg-purple-500 text-white": type === "dinner",
          "bg-yellow-500 text-white": type === "dessert",
          "bg-red-500 text-white": type === "snack",
        }
      )}
    >
      {type === "breakfast" ? (
        <>
          Breakfast
          {/* <ClockIcon className="ml-1 w-4 text-gray-500" /> */}
        </>
      ) : null}
      {type === "lunch" ? (
        <>
          Lunch
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
      {type === "dinner" ? (
        <>
          Dinner
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
      {type === "dessert" ? (
        <>
          Dessert
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
      {type === "snack" ? (
        <>
          Snack
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
    </span>
  );
}
