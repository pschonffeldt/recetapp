import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function RecipesType({ type }: { type: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-blue-500 text-white": type === "Breakfast",
          "bg-green-500 text-white": type === "Lunch",
          "bg-purple-500 text-white": type === "Dinner",
          "bg-yellow-500 text-white": type === "Dessert",
          "bg-red-500 text-white": type === "Snack",
        }
      )}
    >
      {type === "Breakfast" ? (
        <>
          Breakfast
          {/* <ClockIcon className="ml-1 w-4 text-gray-500" /> */}
        </>
      ) : null}
      {type === "Lunch" ? (
        <>
          Lunch
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
      {type === "Dinner" ? (
        <>
          Dinner
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
      {type === "Dessert" ? (
        <>
          Dessert
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
      {type === "Snack" ? (
        <>
          Snack
          {/* <CheckIcon className="ml-1 w-4 text-white" /> */}
        </>
      ) : null}
    </span>
  );
}
