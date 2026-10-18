import { defineConfig } from "eslint/config";
import expo from "eslint-config-expo/flat.js";
export default defineConfig([
  expo,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "contracts/**",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);
