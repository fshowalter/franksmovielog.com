import { debounce } from "~/utils/debounce";

type PagefindAnchor = {
  element: string;
  id: string;
  location: number;
  text: string;
};

type PagefindAPI = {
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

// Types for Pagefind API
type PagefindResult = {
  data(): Promise<PagefindDocument>;
  id: string;
  score: number;
  words: number[];
};

type PagefindSearchOptions = {
  filters?: Record<string, string | string[]>;
  sort?: Record<string, "asc" | "desc">;
  verbose?: boolean;
};

type PagefindSearchResults = {
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

type PagefindSubResult = {
  anchor?: PagefindAnchor;
  excerpt: string;
  title: string;
  url: string;
  weighted_locations: WeightedLocation[];
};

type SearchElements = {
  clearButton: HTMLButtonElement;
  container: HTMLElement;
  filtersContainer?: HTMLElement;
  input: HTMLInputElement;
  loadMoreButton: HTMLButtonElement;
  loadMoreWrapper: HTMLElement;
  resultsContainer: HTMLElement;
  resultsCounter: HTMLElement;
};

// Types for Search UI
type SearchState = {
  error: string | undefined;
  filters: Record<string, Record<string, number>>;
  hasSearched: boolean;
  isSearching: boolean;
  query: string;
  results: PagefindDocument[];
  selectedFilters: Record<string, string[]>;
  totalResults: number;
  visibleResults: number;
};

type WeightedLocation = {
  balanced_score: number;
  location: number;
  weight: number;
};

/**
 * Wrapper around the Pagefind search API
 */
class SearchAPI {
  private isInitialized = false;
  private pagefind: PagefindAPI | undefined = undefined;

  /**
   * Debounced search with configurable delay
   */
  async debouncedSearch(
    query: string,
    options?: PagefindSearchOptions,
    debounceMs = 150,
  ): Promise<PagefindSearchResults> {
    if (!this.pagefind) {
      throw new Error("Pagefind not initialized");
    }

    if (!query.trim()) {
      return this.getEmptyResults();
    }

    try {
      return this.pagefind.debouncedSearch
        ? await this.pagefind.debouncedSearch(query, options, debounceMs)
        : await this.search(query, options);
    } catch (error) {
      console.error("Debounced search failed:", error);
      throw new Error("Search request failed");
    }
  }

  /**
   * Clean up resources
   */
  async destroy(): Promise<void> {
    if (this.pagefind?.destroy) {
      await this.pagefind.destroy();
    }
    this.pagefind = undefined;
    this.isInitialized = false;
  }

  /**
   * Get available filters
   */
  async getFilters(): Promise<Record<string, Record<string, number>>> {
    if (!this.pagefind) {
      throw new Error("Pagefind not initialized");
    }

    try {
      return await this.pagefind.filters();
    } catch (error) {
      console.error("Failed to load filters:", error);
      return {};
    }
  }

  /**
   * Initialize the Pagefind API
   */
  async init(bundlePath: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Dynamically import the Pagefind JS API
      const pagefindPath = bundlePath.endsWith("/")
        ? `${bundlePath}pagefind.js`
        : `${bundlePath}/pagefind.js`;

      this.pagefind = (await import(pagefindPath)) as PagefindAPI;

      // Initialize Pagefind
      if (this.pagefind.init) {
        await this.pagefind.init();
      }

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
   * Check if the API is ready to use
   */
  isReady(): boolean {
    return this.isInitialized && this.pagefind !== undefined;
  }

  /**
   * Load full data for search results
   */
  async loadResultsData(
    results: PagefindSearchResults,
    limit?: number,
  ): Promise<PagefindDocument[]> {
    const resultsToLoad = limit
      ? results.results.slice(0, limit)
      : results.results;

    try {
      const loadPromises = resultsToLoad.map((result) => result.data());
      return await Promise.all(loadPromises);
    } catch (error) {
      console.error("Failed to load results data:", error);
      return [];
    }
  }

  /**
   * Preload search index for a term
   */
  async preload(term: string, options?: PagefindSearchOptions): Promise<void> {
    if (!this.pagefind?.preload) return;

    try {
      await this.pagefind.preload(term, options);
    } catch (error) {
      console.error("Failed to preload search:", error);
      // Don't throw - preloading is an optimization
    }
  }

  /**
   * Perform a search query
   */
  async search(
    query: string,
    options?: PagefindSearchOptions,
  ): Promise<PagefindSearchResults> {
    if (!this.pagefind) {
      throw new Error("Pagefind not initialized");
    }

    if (!query.trim()) {
      return this.getEmptyResults();
    }

    try {
      return await this.pagefind.search(query, options);
    } catch (error) {
      console.error("Search failed:", error);
      throw new Error("Search request failed");
    }
  }

  /**
   * Return empty search results structure
   */
  private getEmptyResults(): PagefindSearchResults {
    return {
      filters: {},
      results: [],
      timings: {
        preload: 0,
        search: 0,
        total: 0,
      },
      totalFilters: {},
      unfilteredResultCount: 0,
    };
  }
}

/**
 * Search UI implementation
 */
class SearchUI {
  private abortController: AbortController | undefined = undefined;
  private api: SearchAPI;
  // Configuration
  private readonly config = {
    bundlePath: import.meta.env.BASE_URL.replace(/\/$/, "") + "/pagefind/",
    debounceTimeoutMs: 150,
    pageSize: 5,
    resultsText: {
      many_results: '[COUNT] results for "[SEARCH_TERM]"',
      one_result: '[COUNT] result for "[SEARCH_TERM]"',
      zero_results: 'No results for "[SEARCH_TERM]"',
    },
    showImages: true,
  };
  // Debounced search function to prevent memory leak
  private readonly debouncedSearch: (query: string) => void;

  private elements: SearchElements | undefined = undefined;
  
  private state: SearchState;

  constructor() {
    this.api = new SearchAPI();
    this.state = this.getInitialState();
    
    // Create debounced search function once during construction
    this.debouncedSearch = debounce(
      (query: string) => {
        void this.handleSearch(query);
      },
      this.config.debounceTimeoutMs,
    );
  }

  /**
   * Initialize the search UI
   */
  async init(): Promise<void> {
    try {
      this.setupElements();
    } catch {
      // Search elements not found - likely in test environment or page without search
      return;
    }

    this.setupEventListeners();

    try {
      await this.api.init(this.config.bundlePath);
    } catch (error) {
      console.error("Failed to initialize search API:", error);
      this.showError("Search functionality could not be loaded.");
    }
  }

  /**
   * Clear search
   */
  private clearSearch(): void {
    if (!this.elements) return;

    this.elements.input.value = "";
    this.elements.clearButton.classList.add("hidden");
    this.updateState(this.getInitialState());
    this.renderResults();
  }

  /**
   * Get error HTML
   */
  private getErrorHTML(message: string): string {
    return `
      <div class="px-4 py-4 font-sans text-xs font-normal text-subtle">
        ${message}
      </div>
    `;
  }

  /**
   * Get initial state
   */
  private getInitialState(): SearchState {
    return {
      error: undefined,
      filters: {},
      hasSearched: false,
      isSearching: false,
      query: "",
      results: [],
      selectedFilters: {},
      totalResults: 0,
      visibleResults: 0,
    };
  }

  /**
   * Get no results HTML
   */
  private getNoResultsHTML(query: string): string {
    return `
      <div class="px-4 py-4 font-sans text-xs font-normal text-subtle">
        ${this.config.resultsText.zero_results.replace("[SEARCH_TERM]", query)}
      </div>
    `;
  }

  /**
   * Get HTML for a single search result
   */
  private getResultHTML(result: PagefindDocument): string {
    // Structure matches the original Pagefind UI exactly
    return `
      <a href="${result.url}" class="group grid gap-6 border-t border-default px-4 py-6 focus-within:bg-subtle focus-within:outline focus-within:outline-1 focus-within:outline-accent focus-within:-outline-offset-2 hover:bg-subtle last:border-b" style="grid-template-columns: min(25%, 80px) 1fr;">
        ${
          this.config.showImages && result.meta.image
            ? `<div class="w-full">
               <img 
                 src="${result.meta.image}" 
                 alt="${result.meta.image_alt || result.meta.title}"
                 class="mx-auto w-full"
                 loading="lazy"
               />
             </div>`
            : `<div></div>`
        }
        <div class="min-w-0">
          <h3 class="font-sans text-base font-semibold leading-5 text-accent">
            ${result.meta.title}
          </h3>
          <div class="mt-1 font-serif text-sm font-normal text-default">
            ${result.excerpt}
          </div>
        </div>
      </a>
    `;
  }

  /**
   * Get results counter HTML
   */
  private getResultsCounterHTML(count: number, query: string): string {
    if (count === 0) {
      return this.config.resultsText.zero_results.replace(
        "[SEARCH_TERM]",
        query,
      );
    }

    const template =
      count === 1
        ? this.config.resultsText.one_result
        : this.config.resultsText.many_results;

    return template
      .replace("[COUNT]", count.toString())
      .replace("[SEARCH_TERM]", query);
  }

  /**
   * Get searching placeholder HTML
   */
  private getSearchingHTML(): string {
    return `
      <div>
        ${Array.from(
          { length: 3 },
          (_, i) => `
          <div class="grid grid-cols-[min(25%,80px)_1fr] gap-6 border-t border-default px-4 py-6 ${i === 2 ? "border-b" : ""} animate-pulse">
            ${
              this.config.showImages
                ? `
              <div class="w-full max-w-[80px]">
                <div class="mx-auto aspect-[3/4] w-full bg-subtle rounded"></div>
              </div>
            `
                : ""
            }
            <div class="min-w-0 space-y-2">
              <div class="h-5 bg-subtle rounded w-3/4"></div>
              <div class="h-4 bg-subtle rounded w-full"></div>
              <div class="h-4 bg-subtle rounded w-2/3"></div>
            </div>
          </div>
        `,
        ).join("")}
      </div>
    `;
  }

  /**
   * Handle search query
   */
  private async handleSearch(query: string): Promise<void> {
    if (!this.api.isReady()) return;

    // Cancel previous search
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      this.updateState({
        error: undefined,
        hasSearched: false,
        isSearching: false,
        results: [],
        totalResults: 0,
        visibleResults: 0,
      });
      this.renderResults();
      return;
    }

    this.updateState({
      error: undefined,
      hasSearched: true,
      isSearching: true,
    });
    this.renderSearching();

    try {
      // Perform search
      const searchResults = await this.api.debouncedSearch(
        trimmedQuery,
        {},
        this.config.debounceTimeoutMs,
      );

      // Check if request was aborted
      if (this.abortController.signal.aborted) {
        return;
      }

      // Load result data
      const results = await this.api.loadResultsData(
        searchResults,
        this.config.pageSize,
      );

      this.updateState({
        filters: searchResults.filters,
        isSearching: false,
        results,
        totalResults: searchResults.unfilteredResultCount,
        visibleResults: results.length,
      });

      this.renderResults();
    } catch (error) {
      if (!this.abortController.signal.aborted) {
        console.error("Search error:", error);
        this.updateState({
          error: "Search failed. Please try again.",
          isSearching: false,
        });
        this.renderError();
      }
    }
  }

  /**
   * Load more search results
   */
  private async loadMoreResults(): Promise<void> {
    if (!this.api.isReady() || this.state.isSearching) return;

    // Remember scroll position before loading
    const scrollWrapper = this.elements?.container.querySelector(
      "#pagefind-results-wrapper",
    ) as HTMLElement;
    const scrollPosition = scrollWrapper?.scrollTop || 0;

    this.updateState({ isSearching: true });

    try {
      const searchResults = await this.api.search(this.state.query);
      const nextBatch = await this.api.loadResultsData(
        searchResults,
        this.state.visibleResults + this.config.pageSize,
      );

      const newResults = nextBatch.slice(this.state.visibleResults);

      this.updateState({
        isSearching: false,
        results: [...this.state.results, ...newResults],
        visibleResults: this.state.results.length + newResults.length,
      });

      this.renderResults();

      // Restore scroll position after rendering
      if (scrollWrapper) {
        scrollWrapper.scrollTop = scrollPosition;
      }
    } catch (error) {
      console.error("Load more error:", error);
      this.updateState({ isSearching: false });
    }
  }

  /**
   * Render error state
   */
  private renderError(): void {
    if (!this.elements) return;

    this.elements.resultsContainer.innerHTML = this.getErrorHTML(
      this.state.error || "An error occurred",
    );
  }

  /**
   * Render search results
   */
  private renderResults(): void {
    if (!this.elements) return;

    const { hasSearched, query, results, totalResults } = this.state;

    if (!hasSearched) {
      this.elements.resultsContainer.innerHTML = "";
      this.elements.resultsCounter.innerHTML = "";
      // Hide load more button wrapper when clearing search
      if (this.elements.loadMoreWrapper) {
        this.elements.loadMoreWrapper.classList.add("hidden");
      }
      return;
    }

    // Update results counter
    this.elements.resultsCounter.innerHTML = this.getResultsCounterHTML(
      totalResults,
      query,
    );

    // Render results list
    this.elements.resultsContainer.innerHTML =
      results.length === 0
        ? this.getNoResultsHTML(query)
        : results.map((result) => this.getResultHTML(result)).join("");

    // Update load more button
    const hasMore = this.state.visibleResults < totalResults;
    if (this.elements.loadMoreWrapper) {
      if (hasMore) {
        this.elements.loadMoreWrapper.classList.remove("hidden");
      } else {
        this.elements.loadMoreWrapper.classList.add("hidden");
      }
    }
  }

  /**
   * Render searching state
   */
  private renderSearching(): void {
    if (!this.elements) return;

    this.elements.resultsCounter.innerHTML = `Searching for "${this.state.query}"...`;
    this.elements.resultsContainer.innerHTML = this.getSearchingHTML();
  }

  /**
   * Set up DOM elements
   */
  private setupElements(): void {
    // Get references to existing elements in the DOM
    this.elements = {
      clearButton: document.querySelector(
        "#pagefind-clear-button",
      ) as HTMLButtonElement,
      container: document.querySelector("[data-dialog-frame]") as HTMLElement,
      input: document.querySelector(
        "#pagefind-search-input",
      ) as HTMLInputElement,
      loadMoreButton: document.querySelector(
        "#pagefind-load-more",
      ) as HTMLButtonElement,
      loadMoreWrapper: document.querySelector(
        "#pagefind-load-more-wrapper",
      ) as HTMLElement,
      resultsContainer: document.querySelector(
        "#pagefind-results",
      ) as HTMLElement,
      resultsCounter: document.querySelector(
        "#pagefind-results-counter",
      ) as HTMLElement,
    };

    if (!this.elements.input || !this.elements.resultsContainer) {
      throw new Error("Required search elements not found");
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    if (!this.elements) return;

    const { clearButton, input, loadMoreButton } = this.elements;

    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      this.updateState({ query: target.value });

      // Show/hide clear button based on input content
      if (target.value) {
        clearButton.classList.remove("hidden");
      } else {
        clearButton.classList.add("hidden");
      }

      this.debouncedSearch(target.value);
    });

    // Clear button
    clearButton.addEventListener("click", () => {
      this.clearSearch();
      input.focus();
    });

    // Load more button
    loadMoreButton.addEventListener("click", () => {
      void this.loadMoreResults();
    });

    // Focus input when container is clicked (for accessibility)
    this.elements.container.addEventListener("click", (e) => {
      if (e.target === this.elements!.container) {
        input.focus();
      }
    });
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    if (!this.elements) return;
    this.elements.resultsContainer.innerHTML = this.getErrorHTML(message);
  }

  /**
   * Update component state
   */
  private updateState(updates: Partial<SearchState>): void {
    this.state = { ...this.state, ...updates };
  }
}

// Store reference to SearchUI instance for lazy loading
let searchUIInstance: SearchUI | undefined;

/**
 * Initialize the search modal controls
 */
export function initPageFind(): void {
  // Set keyboard shortcuts for Mac users
  (() => {
    const openBtn = document.querySelector("button[data-open-modal]");
    if (!openBtn) return;
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
      openBtn.setAttribute("aria-keyshortcuts", "Meta+K");
      openBtn.setAttribute("title", `Search: ⌘K`);
    }
  })();

  const openBtn = document.querySelector<HTMLButtonElement>(
    "button[data-open-modal]",
  );
  const closeBtn = document.querySelector<HTMLButtonElement>(
    "button[data-close-modal]",
  );
  const dialog = document.querySelector<HTMLDialogElement>("dialog");
  const dialogFrame = document.querySelector<HTMLDivElement>(
    "div[data-dialog-frame]",
  );

  if (!openBtn || !closeBtn || !dialog || !dialogFrame) {
    return;
  }

  // ios safari doesn't bubble click events unless a parent has a listener
  document.body.addEventListener("click", () => {});

  /** Close the modal if a user clicks on a link or outside of the modal. */
  const onClick = (event: MouseEvent) => {
    // Handle clear button focus first - refocus the input after clearing
    if (
      event.target instanceof HTMLButtonElement &&
      event.target.id === "pagefind-clear-button"
    ) {
      const input = document.querySelector(
        "#pagefind-search-input",
      ) as HTMLInputElement;
      input?.focus();
      return; // Don't close the modal for clear button
    }

    const isLink = "href" in (event.target || {});
    if (
      isLink ||
      (document.body.contains(event.target as Node) &&
        !dialogFrame.contains(event.target as Node))
    ) {
      closeModal();
    }
  };

  const openModal = async (event?: MouseEvent) => {
    dialog.showModal();
    document.body.toggleAttribute("data-search-modal-open", true);

    // Lazy-load SearchUI on first open
    if (!searchUIInstance) {
      searchUIInstance = new SearchUI();
      await searchUIInstance.init();
    }

    // Focus the search input after modal opens
    requestAnimationFrame(() => {
      const input = document.querySelector(
        "#pagefind-search-input",
      ) as HTMLInputElement;
      input?.focus();
    });

    event?.stopPropagation();
    globalThis.addEventListener("click", onClick);
  };

  const closeModal = () => dialog.close();

  openBtn.addEventListener("click", (e) => void openModal(e));
  openBtn.disabled = false;
  closeBtn.addEventListener("click", closeModal);

  dialog.addEventListener("close", () => {
    document.body.toggleAttribute("data-search-modal-open", false);
    globalThis.removeEventListener("click", onClick);
  });

  // Listen for `ctrl + k` and `cmd + k` keyboard shortcuts.
  globalThis.addEventListener("keydown", (e: KeyboardEvent) => {
    if ((e.metaKey === true || e.ctrlKey === true) && e.key === "k") {
      if (dialog.open) closeModal();
      else {
        void openModal();
      }
      e.preventDefault();
    }

    // Handle Enter key in search input
    if (
      e.target instanceof HTMLInputElement &&
      e.target.id === "pagefind-search-input" &&
      e.key === "Enter"
    ) {
      e.target.blur();
    }
  });
}

/**
 * Initialize search functionality
 */
export function initSearch(): void {
  initPageFind();
  // SearchUI is now lazy-loaded when the modal opens
}

/**
 * Initialize the search UI (PagefindUI replacement)
 * @deprecated Use lazy loading via initPageFind instead
 */
export function initSearchUI(): void {
  const onIdle = globalThis.requestIdleCallback || ((cb) => setTimeout(cb, 1));

  onIdle(() => {
    void (async () => {
      const searchUI = new SearchUI();
      await searchUI.init();
    })();
  });
}

// Initialize when DOM is ready (skip in test environment)
if (typeof process === "undefined" || !process.env?.VITEST) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
}
