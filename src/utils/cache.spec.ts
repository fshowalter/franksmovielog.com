import { describe, expect, it } from "vitest";

import {
  createCacheConfig,
  createCacheKey,
  ENABLE_CACHE,
  ensureCacheDir,
  getCachedItem,
  saveCachedItem,
} from "./cache";

describe("cache", () => {
  describe("ENABLE_CACHE", () => {
    it("should be enabled in test mode", () => {
      expect(ENABLE_CACHE).toBe(true);
    });
  });

  describe("caching operations", () => {
    it("should save and retrieve cached items", async () => {
      const config = createCacheConfig("test-cache");
      const cacheKey = createCacheKey("test-key");
      const testContent = "test content";

      // Ensure cache directory exists
      await ensureCacheDir(config.cacheDir);

      // Save item to cache
      await saveCachedItem(config.cacheDir, cacheKey, "txt", testContent);

      // Retrieve item from cache
      const cachedContent = await getCachedItem<string>(
        config.cacheDir,
        cacheKey,
        "txt",
        false,
        config.debugCache,
        "test cache item",
      );

      expect(cachedContent).toBe(testContent);
    });

    it("should return undefined for non-existent cache items", async () => {
      const config = createCacheConfig("test-cache");
      const cacheKey = createCacheKey("non-existent-key");

      const cachedContent = await getCachedItem<string>(
        config.cacheDir,
        cacheKey,
        "txt",
        false,
        config.debugCache,
        "non-existent item",
      );

      expect(cachedContent).toBeUndefined();
    });

    it("should handle binary data", async () => {
      const config = createCacheConfig("test-cache");
      const cacheKey = createCacheKey("binary-key");
      const testContent = new Uint8Array([1, 2, 3, 4, 5]);

      // Ensure cache directory exists
      await ensureCacheDir(config.cacheDir);

      // Save binary item to cache
      await saveCachedItem(config.cacheDir, cacheKey, "bin", testContent);

      // Retrieve binary item from cache
      const cachedContent = await getCachedItem<Buffer>(
        config.cacheDir,
        cacheKey,
        "bin",
        true,
        config.debugCache,
        "binary cache item",
      );

      // Convert Buffer to Uint8Array for comparison
      expect(new Uint8Array(cachedContent!)).toEqual(testContent);
    });
  });

  describe("createCacheConfig", () => {
    it("should create config with cache enabled in test mode", () => {
      const config = createCacheConfig("test");
      expect(config.cacheDir).toContain(".cache/test");
      expect(config.enableCache).toBe(true);
    });
  });
});
