import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  {
    extends: [...nextCoreWebVitals, ...nextTypescript],
  },

  // Make strict ESLint usable in an existing codebase
  {
    rules: {
      // Keep visibility, but don’t block builds yet
      "@typescript-eslint/no-explicit-any": "warn",

      // This rule is often too aggressive for real-world apps.
      // You can re-enable later once the codebase is refactored.
      "react-hooks/set-state-in-effect": "off",
    },
  },

  // Allow require() in config files (Tailwind config, etc.)
  {
    files: ["**/*.config.*", "eslint.config.*", "tailwind.config.*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
