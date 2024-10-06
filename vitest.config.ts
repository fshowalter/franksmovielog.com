/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // Vitest configuration options
    setupFiles: ["setupTests.ts"],
    globals: true, // needed for testing-library teardown
    environmentMatchGlobs: [
      ["src/api/**", "node"],
      ["src/pages/**", "node"],
      ["src/components/**/*.ts", "node"],
      ["src/components/**/*.tsx", "jsdom"],
      // ...
    ],
    coverage: {
      provider: "istanbul",
      include: ["src/**"],
    },
  },
});
