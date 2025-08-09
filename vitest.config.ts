/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src/**"],
      exclude: ["src/api/data/utils/getContentPath.ts"],
      provider: "istanbul",
    },
    globals: true, // needed for testing-library teardown
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/api/**/*.spec.ts"],
          name: "api-node",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/pages/**/*.spec.ts"],
          name: "pages-node",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/components/**/*.spec.ts"],
          name: "components-node",
        },
      },
      {
        extends: true,
        test: {
          environment: "jsdom",
          include: ["src/components/**/*.spec.tsx"],
          name: "components-jsdom",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/layouts/**/*.spec.ts"],
          name: "layouts-node",
        },
      },
    ],
    // Vitest configuration options
    setupFiles: ["setupTests.ts"],
  },
});
