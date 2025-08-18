// eslint.config.js
import { defineConfig } from "eslint/config";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply to TypeScript files
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json", // Path to your tsconfig.json for type-aware linting
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint,
    },
    extends: [
      "eslint:recommended", // ESLint's core recommended rules
      "plugin:@typescript-eslint/recommended", // TypeScript-specific recommended rules
      "plugin:@typescript-eslint/recommended-type-checked", // Recommended rules requiring type information
      "plugin:@typescript-eslint/strict-type-checked", // Strict rules requiring type information
      "plugin:@typescript-eslint/stylistic-type-checked", // Stylistic rules requiring type information
    ],
    rules: {
      // Add or override specific rules here
      // For example, disallow explicit any type:
      "@typescript-eslint/no-explicit-any": "error",
      // Require consistent type imports:
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"], // Apply to JavaScript files
    extends: ["eslint:recommended"],
    rules: {
      // JavaScript-specific rules if needed
    },
  },
]);