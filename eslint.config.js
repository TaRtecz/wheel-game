// eslint.config.js
import { defineConfig } from "eslint/config";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

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
      prettier: prettier,
    },
    extends: [
      "eslint:recommended", // ESLint's core recommended rules
      "plugin:@typescript-eslint/recommended", // TypeScript-specific recommended rules
      "plugin:@typescript-eslint/recommended-type-checked", // Recommended rules requiring type information
      "plugin:@typescript-eslint/strict-type-checked", // Strict rules requiring type information
      "plugin:@typescript-eslint/stylistic-type-checked", // Stylistic rules requiring type information
      prettierConfig, // Disable ESLint rules that conflict with Prettier
    ],
    rules: {
      // Add or override specific rules here
      // For example, disallow explicit any type:
      "@typescript-eslint/no-explicit-any": "error",
      // Require consistent type imports:
      "@typescript-eslint/consistent-type-imports": "error",
      // Prettier rules
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"], // Apply to JavaScript files
    plugins: {
      prettier: prettier,
    },
    extends: [
      "eslint:recommended",
      prettierConfig,
    ],
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.vue"], // Apply to Vue files
    plugins: {
      prettier: prettier,
    },
    extends: [
      prettierConfig,
    ],
    rules: {
      "prettier/prettier": "error",
    },
  },
]);