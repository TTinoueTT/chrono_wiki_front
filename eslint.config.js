import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",
      "arrow-spacing": "error",
      "no-console": ["warn", { allow: ["info", "warn", "error", "assert"] }],
    },
  },
];
