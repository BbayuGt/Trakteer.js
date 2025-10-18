
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended, // ESLint's built-in JS rules
  ...tseslint.configs.recommended, // TypeScript ESLint recommended rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true, // uses your tsconfig.json
      },
      globals: globals.node, // change to globals.browser if frontend
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // optional overrides
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);

