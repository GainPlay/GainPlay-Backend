import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";
import prettierEslintRecommended from "eslint-plugin-prettier/recommended";

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  prettierEslintRecommended,
  {
    plugins: {
      perfectionist,
    },
    settings: {
      perfectionist: {
        type: "line-length",
        partitionByComment: true,
        partitionByNewLine: true,
      },
    },
    rules: {
      "perfectionist/sort-objects": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          arrowParens: "avoid",
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          environment: "bun",
          newlinesBetween: "ignore",
        },
      ],
    },
  },
);
