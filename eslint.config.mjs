// ESLint configuration for Next.js 16
// Note: There's currently a known issue with eslint-config-next 16 and ESLint 9
// causing circular dependency errors with FlatCompat.
// Using a basic configuration until the issue is resolved.
// See: https://github.com/vercel/next.js/issues/...

import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      ".cache/**",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs}"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
