// Types for Pagefind API
export type PagefindAPI = {
  debouncedSearch(
    query: string,
    options?: PagefindSearchOptions,
    debounceTimeoutMs?: number,
  ): Promise<PagefindSearchResults>;
  destroy(): Promise<void>;
  filters(): Promise<Record<string, Record<string, number>>>;
  init(): Promise<void>;
  preload(term: string, options?: PagefindSearchOptions): Promise<void>;
  search(
    query: string,
    options?: PagefindSearchOptions,
  ): Promise<PagefindSearchResults>;
};

export type PagefindResult = {
  data(): Promise<PagefindDocument>;
  id: string;
  score: number;
  words: number[];
};

export type PagefindSearchOptions = {
  filters?: Record<string, string | string[]>;
  sort?: Record<string, "asc" | "desc">;
  verbose?: boolean;
};

export type PagefindSearchResults = {
  filters: Record<string, Record<string, number>>;
  results: PagefindResult[];
  timings: {
    preload: number;
    search: number;
    total: number;
  };
  totalFilters: Record<string, Record<string, number>>;
  unfilteredResultCount: number;
};

type PagefindAnchor = {
  element: string;
  id: string;
  location: number;
  text: string;
};

type PagefindDocument = {
  anchors?: PagefindAnchor[];
  excerpt: string;
  filters: Record<string, string>;
  meta: {
    image?: string;
    image_alt?: string;
    title: string;
  };
  sub_results?: PagefindSubResult[];
  url: string;
  weighted_locations: WeightedLocation[];
};

type PagefindSubResult = {
  anchor?: PagefindAnchor;
  excerpt: string;
  title: string;
  url: string;
  weighted_locations: WeightedLocation[];
};

type WeightedLocation = {
  balanced_score: number;
  location: number;
  weight: number;
};

/**
 * Wrapper for the Pagefind search API
 */
export class SearchAPI {
  private api: PagefindAPI | undefined = undefined;
  private isInitialized = false;

  /**
   * Clean up the API
   */
  async destroy(): Promise<void> {
    if (this.api) {
      await this.api.destroy();
      this.api = undefined;
      this.isInitialized = false;
    }
  }

  /**
   * Initialize the Pagefind API
   */
  async init(bundlePath: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Dynamically import Pagefind
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const pagefindModule = await import(
        /* @vite-ignore */ `${bundlePath}pagefind.js`
      );

      // Initialize Pagefind with options
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await pagefindModule.options({
        baseUrl: import.meta.env.BASE_URL,
        bundlePath,
      });

      // Store the API reference
      this.api = pagefindModule as PagefindAPI;

      // Initialize the API
      await this.api.init();
      this.isInitialized = true;
    } catch (error) {
      // In test environment, silently fail
      if (import.meta.env.MODE === "test") {
        console.warn("Pagefind not available in test environment");
        return;
      }
      console.error("Failed to initialize Pagefind:", error);
      throw new Error("Search functionality could not be loaded");
    }
  }

  /**
   * Perform a search
   */
  async search(
    query: string,
    options?: PagefindSearchOptions & { signal?: AbortSignal },
  ): Promise<PagefindSearchResults> {
    if (!this.api) {
      throw new Error("Search API not initialized");
    }

    // Extract signal from options
    const { signal, ...searchOptions } = options || {};

    // Create a promise that rejects on abort
    const abortPromise = signal
      ? new Promise<never>((_, reject) => {
          signal.addEventListener("abort", () => {
            reject(new DOMException("Search aborted", "AbortError"));
          });
        })
      : undefined;

    // Race between search and abort
    const searchPromise = this.api.debouncedSearch
      ? this.api.debouncedSearch(query, searchOptions, 0)
      : this.api.search(query, searchOptions);

    if (abortPromise) {
      return Promise.race([searchPromise, abortPromise]);
    }

    return searchPromise;
  }
}