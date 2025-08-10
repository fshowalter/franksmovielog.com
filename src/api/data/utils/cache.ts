import { parse, stringify } from "devalue";
import { promises as fs } from "node:fs";
import path from "node:path";
import xxhash from "xxhash-wasm";

type CacheEntry<T> = {
  data: T;
  digest: string;
  timestamp: number;
}

type CacheStore<T> = {
  entries: Record<string, CacheEntry<T>>;
  schemaVersion: string;
}

let xxhashInstance: Awaited<ReturnType<typeof xxhash>> | undefined;

export class ContentCache<T> {
  private cache: CacheStore<T> | undefined;
  private cachePath: string;
  private enabled: boolean;
  private schemaVersion: string;

  constructor(cacheName: string, schemaVersion: string) {
    // Determine cache path based on environment
    const isTest = import.meta.env?.MODE === "test";
    const isDev = import.meta.env?.DEV === true;
    
    // Bypass cache entirely in dev mode only (but not in test mode)
    // Tests will use cache to ensure end-to-end testing
    this.enabled = !isDev || isTest;
    
    // Use process-specific cache in test mode to avoid race conditions
    if (isTest) {
      // Use process ID and timestamp to create unique cache directory per test run
      // This avoids race conditions between parallel test runs
      const testRunId = process.env.TEST_CACHE_ID || `${process.pid}-${Date.now()}`;
      const cacheDir = `.cache-test-${testRunId}`;
      this.cachePath = path.join(process.cwd(), cacheDir, `${cacheName}.json`);
      
      // Store the test run ID for cleanup
      if (!process.env.TEST_CACHE_ID) {
        process.env.TEST_CACHE_ID = testRunId;
      }
    } else {
      // Production cache
      const cacheDir = ".cache";
      this.cachePath = path.join(process.cwd(), cacheDir, `${cacheName}.json`);
    }
    
    this.schemaVersion = schemaVersion;
  }

  async get(
    filePath: string,
    content: string,
    parser: (content: string) => Promise<T> | T
  ): Promise<T> {
    // Bypass cache if disabled (dev mode)
    if (!this.enabled) {
      return parser(content);
    }
    
    const cache = await this.loadCache();
    const contentHash = await this.getContentHash(content);
    
    const cacheEntry = cache.entries[filePath];
    
    // Check if we have a valid cache entry
    if (cacheEntry && cacheEntry.digest === contentHash) {
      // Cache hit!
      return cacheEntry.data;
    }
    
    // Cache miss - parse the content
    const parsedData = await parser(content);
    
    // Update cache
    cache.entries[filePath] = {
      data: parsedData,
      digest: contentHash,
      timestamp: Date.now(),
    };
    
    // Save cache to disk (async, don't wait)
    this.saveCache().catch(console.error);
    
    return parsedData;
  }

  async getContentHash(content: string): Promise<string> {
    const hasher = await getXXHash();
    const hash = hasher.h64(content);
    return hash.toString();
  }


  async invalidate(filePath?: string): Promise<void> {
    const cache = await this.loadCache();
    
    if (filePath) {
      // Invalidate specific file
      delete cache.entries[filePath];
    } else {
      // Invalidate entire cache
      cache.entries = {};
    }
    
    await this.saveCache();
  }

  private async ensureCacheDir(): Promise<void> {
    const cacheDir = path.dirname(this.cachePath);
    try {
      await fs.mkdir(cacheDir, { recursive: true });
    } catch {
      // Directory already exists
    }
  }

  private async loadCache(): Promise<CacheStore<T>> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const cacheData = await fs.readFile(this.cachePath, "utf8");
      const parsedCache = parse(cacheData) as CacheStore<T>;
      
      // Check if schema version matches
      this.cache = parsedCache.schemaVersion === this.schemaVersion
        ? parsedCache
        : {
            entries: {},
            schemaVersion: this.schemaVersion,
          };
    } catch {
      // Cache doesn't exist or is corrupted, create new one
      this.cache = {
        entries: {},
        schemaVersion: this.schemaVersion,
      };
    }

    return this.cache;
  }

  private async saveCache(): Promise<void> {
    if (!this.cache) return;

    await this.ensureCacheDir();
    await fs.writeFile(
      this.cachePath,
      stringify(this.cache),
      "utf8"
    );
  }
}

// Helper to generate schema version from multiple schemas
export async function generateSchemaHash(...schemas: string[]): Promise<string> {
  const hasher = await getXXHash();
  const combinedSchemas = schemas.join("\n");
  const hash = hasher.h64(combinedSchemas);
  return hash.toString();
}

async function getXXHash() {
  if (!xxhashInstance) {
    xxhashInstance = await xxhash();
  }
  return xxhashInstance;
}