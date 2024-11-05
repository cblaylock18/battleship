import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    env: {
      browser: true, // Enable browser global variables like `window`
      es2021: true, // Enable ES2021 features
      node: true, // Enable Node.js global variables and Node.js scoping
      jest: true, // Enable Jest global variables
    },
    extends: [
      "eslint:recommended", // Use ESLint's recommended rules
      "plugin:jest/recommended", // Use Jest plugin's recommended rules
    ],
    parserOptions: {
      ecmaVersion: 12, // Specify ECMAScript version
      sourceType: "module", // Enable ES modules
    },
    plugins: [
      "jest", // Enable Jest plugin
    ],
    rules: {
      // You can customize your ESLint rules here
      // For example, to allow console statements:
      "no-console": "off",

      // To enforce consistent indentation:
      indent: ["error", 4],

      // To disallow unused variables:
      "no-unused-vars": ["warn"],

      // Add more rules as needed
    },
    overrides: [
      {
        files: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"], // Match test files
        env: {
          jest: true, // Ensure Jest environment for test files
        },
        rules: {
          // You can add or override rules specifically for test files here
          "no-unused-expressions": "off",
        },
      },
    ],
  },
  pluginJs.configs.recommended,
];
