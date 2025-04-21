import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        {
          "ts-ignore": false,
          "ts-expect-error": true,
          minimumDescriptionLength: 3,
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "no-console": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/public/sw.js",
      "**/public/workbox-*.js",
      "**/public/worker-*.js",
      "**/public/firebase-messaging-sw.js",
      "**/public/sw-*.js",
      "**/components/ui/**",
    ],
  },
];
