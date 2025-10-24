/**
 * branding.ts
 * ---------------------------------------------------------------------------
 * Minimal helper to map semantic color tokens to Tailwind classes.
 *
 * Why:
 * - Centralize color choices (brand, background, positive, etc.)
 * - Use them via one tiny function in JSX: brand("brand"), brand("brand","text")
 *
 * Exports:
 *   - brand(token, kind = "bg") -> string
 *       Returns a Tailwind class like "bg-blue-600", "text-blue-600", or "border-blue-600".
 *       token: "background" | "brand" | "alt" | "positive" | "destructive"
 *       kind:  "bg" | "text" | "border"
 *
 * ---------------------------------------------------------------------------
 * How to implement (quick start)
 * 1) Put this file anywhere in your project (e.g., src/lib/branding.ts).
 * 2) Import the helper in your components:
 *
 *    import { brand } from "@/lib/branding";
 *
 * 3) Use it in className alongside your existing utilities:
 *
 *    <div className={`${brand("brand")} p-4 rounded`}>Primary BG</div>
 *    <h1 className={brand("brand", "text")}>Brand heading</h1>
 *    <hr className={brand("alt", "border")} />
 *
 * 4) Change the palette by editing the CLASSES map below (swap to your shades).
 *
 * Optional patterns:
 * - Buttons:
 *    const btn = `${brand("brand")} ${brand("background","text")} px-4 py-2 rounded`;
 *    <button className={btn}>Buy</button>
 *
 * - Conditional kind:
 *    const kind = isDanger ? "bg" : "border";
 *    <div className={brand(isDanger ? "destructive" : "positive", kind)} />
 *
 * ⚠️ Tailwind JIT note about variants (hover:, focus:, etc.)
 * - If you compose variants like: `className={\`hover:${brand("brand")}\`}`,
 *   Tailwind may NOT detect `hover:bg-...` because it doesn’t see the final string literal.
 * - Easiest fixes:
 *     a) Write the variant literally where needed (e.g., "hover:bg-blue-700"), or
 *     b) Add a safelist in tailwind.config for the variant forms you’ll use, e.g.:
 *          safelist: ["hover:bg-blue-600", "hover:bg-red-600", "hover:bg-green-600"]
 *   (The base classes like "bg-blue-600" ARE detected because they live as string literals
 *    in the CLASSES map below.)
 * ---------------------------------------------------------------------------
 */

type Token = "background" | "brand" | "alt" | "positive" | "destructive";
type Kind = "bg" | "text" | "border";

const CLASSES: Record<Token, Record<Kind, string>> = {
  background: {
    bg: "bg-slate-900",
    text: "text-slate-900",
    border: "border-slate-900",
  },
  brand: {
    bg: "bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-600",
  },
  alt: { bg: "bg-sky-500", text: "text-sky-500", border: "border-sky-500" },
  positive: {
    bg: "bg-green-600",
    text: "text-green-600",
    border: "border-green-600",
  },
  destructive: {
    bg: "bg-red-600",
    text: "text-red-600",
    border: "border-red-600",
  },
};

/** Returns "bg-blue-600" / "text-blue-600" / "border-blue-600". */
export const brand = (token: Token, kind: Kind = "bg") => CLASSES[token][kind];
