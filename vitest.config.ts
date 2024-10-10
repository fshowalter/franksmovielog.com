/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src/**"],
      provider: "istanbul",
    },
    environmentMatchGlobs: [
      ["src/api/**", "node"],
      ["src/pages/**", "node"],
      ["src/components/**/*.ts", "node"],
      ["src/components/**/*.tsx", "jsdom"],
      // ...
    ],
    globals: true, // needed for testing-library teardown
    // Vitest configuration options
    setupFiles: ["setupTests.ts"],
  },
});
