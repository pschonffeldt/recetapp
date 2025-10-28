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
      {type === "breakfast" ? <>Breakfast</> : null}
      {type === "lunch" ? <>Lunch</> : null}
      {type === "dinner" ? <>Dinner</> : null}
      {type === "dessert" ? <>Dessert</> : null}
      {type === "snack" ? <>Snack</> : null}
    </span>
  );
}
