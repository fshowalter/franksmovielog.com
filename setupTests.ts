import "@testing-library/jest-dom/vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { afterAll, vi } from "vitest";

vi.mock("src/api/data/utils/getContentPath");

// Store the cache directory for this test run
let testCacheDir: string | undefined;

// Clean up test cache directories after all tests complete
afterAll(async () => {
  // Clean up the cache directory created by this process
  const testCacheId = process.env.TEST_CACHE_ID;
  if (testCacheId) {
    testCacheDir = path.join(process.cwd(), `.cache-test-${testCacheId}`);
    try {
      await fs.rm(testCacheDir, { force: true, recursive: true });
    } catch {
      // Ignore errors - directory may not exist
    }
  }

  // Also clean up any old test cache directories from previous runs
  // (in case they weren't cleaned up properly due to test failures)
  try {
    const files = await fs.readdir(process.cwd());
    const oldCacheDirs = files.filter((f) => f.startsWith(".cache-test-"));

    for (const dir of oldCacheDirs) {
      // Skip the current test's cache directory
      if (testCacheDir && dir === path.basename(testCacheDir)) continue;

      const dirPath = path.join(process.cwd(), dir);
      const stats = await fs.stat(dirPath);

      // Only delete directories older than 1 hour (to avoid deleting active test caches)
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (stats.isDirectory() && stats.mtimeMs < oneHourAgo) {
        await fs.rm(dirPath, { force: true, recursive: true });
      }
    }
  } catch {
    // Ignore errors during cleanup
  }
});
