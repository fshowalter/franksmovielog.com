import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

type CacheConfig = {
  cacheDir: string;
  debugCache?: boolean;
  enableCache: boolean;
};

/**
 * Determines if caching should be enabled based on environment
 * - Disabled in development mode (DEV=true)
 * - Enabled in test mode (MODE=test) to test cache behavior
 * - Enabled in production builds
 */
export const ENABLE_CACHE = (() => {
  // Enable caching in test mode to test cache behavior
  if (import.meta.env.MODE === "test") {
    return true;
  }
  // Disable in dev mode
  return !import.meta.env.DEV;
})();

/**
 * Creates a cache configuration object for a named cache.
 * @param name - The name of the cache (used as subdirectory in .cache)
 * @returns Cache configuration with directory, debug settings, and enabled state
 */
export function createCacheConfig(name: string): CacheConfig {
  return {
    cacheDir: path.join(process.cwd(), ".cache", name),
    debugCache: process.env.DEBUG_CACHE === "true",
    enableCache: ENABLE_CACHE,
  };
}

/**
 * Generates a SHA256 hash key from the provided data string.
 * @param data - The data to hash for cache key generation
 * @returns Hex-encoded SHA256 hash to use as cache key
 */
export function createCacheKey(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

/**
 * Ensures the cache directory exists, creating it recursively if needed.
 * @param cacheDir - The cache directory path to ensure exists
 */
export async function ensureCacheDir(cacheDir: string): Promise<void> {
  await fs.mkdir(cacheDir, { recursive: true });
}

/**
 * Retrieves a cached item from disk if it exists.
 * @param cacheDir - The cache directory path
 * @param cacheKey - The cache key (typically a hash)
 * @param extension - File extension for the cached file
 * @param binary - Whether to read as binary data (default: false)
 * @param debugCache - Whether to log cache hit/miss messages
 * @param debugMessage - Custom message to include in debug logs
 * @returns The cached content or undefined if not found
 */
export async function getCachedItem<T = string>(
  cacheDir: string,
  cacheKey: string,
  extension: string,
  binary: boolean = false,
  debugCache?: boolean,
  debugMessage?: string,
): Promise<T | undefined> {
  const cachePath = getCachePath(cacheDir, cacheKey, extension);

  try {
    const result = binary
      ? ((await fs.readFile(cachePath)) as T)
      : ((await fs.readFile(cachePath, "utf8")) as T);

    if (debugCache && debugMessage) {
      console.log(`[CACHE HIT] ${debugMessage}`);
    }

    return result;
  } catch {
    if (debugCache && debugMessage) {
      console.log(`[CACHE MISS] ${debugMessage}`);
    }
    return undefined;
  }
}

/**
 * Saves content to the cache on disk.
 * @param cacheDir - The cache directory path
 * @param cacheKey - The cache key (typically a hash)
 * @param extension - File extension for the cached file
 * @param content - The content to cache (string or binary data)
 */
export async function saveCachedItem(
  cacheDir: string,
  cacheKey: string,
  extension: string,
  content: Buffer<ArrayBufferLike> | string,
): Promise<void> {
  const cachePath = getCachePath(cacheDir, cacheKey, extension);
  const cacheSubDir = path.dirname(cachePath);

  await fs.mkdir(cacheSubDir, { recursive: true });

  await (typeof content === "string"
    ? fs.writeFile(cachePath, content, "utf8")
    : fs.writeFile(cachePath, content));
}

function getCachePath(
  cacheDir: string,
  cacheKey: string,
  extension: string,
): string {
  const subDir = cacheKey.slice(0, 2);
  return path.join(cacheDir, subDir, `${cacheKey}.${extension}`);
}
