import { debounce } from "~/utils/debounce";

import type { SearchAPI } from "./search-api";

export type PagefindDocument = {
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

// Re-export types that might be needed
export type PagefindResult = {
  data(): Promise<PagefindDocument>;
  id: string;
  score: number;
  words: number[];
};

type PagefindAnchor = {
  element: string;
  id: string;
  location: number;
  text: string;
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
 * Search UI implementation
 */
export class SearchUI {
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

  constructor(api: SearchAPI) {
    this.api = api;
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

  // Utility methods for storing remaining results in sessionStorage
  private getRemainingResults(): PagefindResult[] {
    const stored = sessionStorage.getItem("pagefind-remaining");
    return stored ? (JSON.parse(stored) as PagefindResult[]) : [];
  }

  /**
   * Handle search
   */
  private async handleSearch(query: string): Promise<void> {
    if (!this.elements) return;

    // Cancel any existing search
    if (this.abortController) {
      this.abortController.abort();
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      this.clearSearch();
      return;
    }

    // Create new abort controller for this search
    this.abortController = new AbortController();

    this.updateState({
      error: undefined,
      hasSearched: true,
      isSearching: true,
    });
    this.renderResults();

    try {
      const searchResults = await this.api.search(trimmedQuery, {
        signal: this.abortController.signal,
      });

      // Ignore if this search was aborted
      if (this.abortController.signal.aborted) {
        return;
      }

      const resultData = await Promise.all(
        searchResults.results.slice(0, this.config.pageSize).map((r) => {
          return r.data();
        }),
      );

      this.updateState({
        filters: searchResults.filters,
        isSearching: false,
        results: resultData,
        totalResults: searchResults.results.length,
        visibleResults: resultData.length,
      });

      // Store remaining results for "load more"
      this.storeRemainingResults(searchResults.results.slice(this.config.pageSize));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Search was cancelled, ignore
        return;
      }

      console.error("Search failed:", error);
      this.updateState({
        error: "Search failed. Please try again.",
        isSearching: false,
      });
    }

    this.renderResults();
  }

  /**
   * Load more results
   */
  private async loadMoreResults(): Promise<void> {
    if (!this.elements) return;

    const remainingResults = this.getRemainingResults();
    if (remainingResults.length === 0) return;

    const nextBatch = remainingResults.slice(0, this.config.pageSize);
    const scrollPosition = this.elements.resultsContainer.scrollTop;

    try {
      const resultData = await Promise.all(
        nextBatch.map((r) => {
          return r.data();
        }),
      );

      this.updateState({
        results: [...this.state.results, ...resultData],
        visibleResults: this.state.visibleResults + resultData.length,
      });

      this.storeRemainingResults(remainingResults.slice(this.config.pageSize));
      this.renderResults();

      // Restore scroll position
      this.elements.resultsContainer.scrollTop = scrollPosition;
    } catch (error) {
      console.error("Failed to load more results:", error);
      this.showError("Failed to load more results.");
    }
  }

  /**
   * Render loading skeleton
   */
  private renderLoadingSkeleton(): string {
    const skeletonItem = `
      <div class="animate-pulse px-4 py-4">
        <div class="flex gap-4">
          ${
            this.config.showImages
              ? `
            <div class="h-12 w-16 flex-shrink-0 bg-subtle"></div>
          `
              : ""
          }
          <div class="min-w-0 flex-1">
            <div class="mb-2 h-5 w-3/4 bg-subtle"></div>
            <div class="h-3 w-full bg-subtle"></div>
            <div class="mt-1 h-3 w-5/6 bg-subtle"></div>
          </div>
        </div>
      </div>
    `;

    return Array.from({ length: 3 })
      .map(() => skeletonItem)
      .join("");
  }

  /**
   * Render a single result item
   */
  private renderResultItem(result: PagefindDocument): string {
    const { image, image_alt, title } = result.meta;

    return `
      <a href="${result.url}" class="block" role="listitem">
        <article class="flex gap-4 px-4 py-4 hover:bg-subtle">
          ${
            this.config.showImages && image
              ? `
            <div class="w-16 flex-shrink-0">
              <img 
                src="${image}" 
                alt="${image_alt || ""}"
                class="h-auto w-full"
                loading="lazy"
              >
            </div>
          `
              : ""
          }
          <div class="min-w-0 flex-1">
            <h3 class="mb-2 font-serif text-base font-medium text-default">
              ${title}
            </h3>
            <p class="font-sans text-xs leading-4 text-subtle">
              ${result.excerpt}
            </p>
          </div>
        </article>
      </a>
    `;
  }

  /**
   * Render search results
   */
  private renderResults(): void {
    if (!this.elements) return;

    const {
      error,
      hasSearched,
      isSearching,
      query,
      results,
      totalResults,
      visibleResults,
    } = this.state;

    // Update results counter
    if (hasSearched && !isSearching) {
      let counterText = "";
      if (totalResults === 0) {
        counterText = this.config.resultsText.zero_results;
      } else if (totalResults === 1) {
        counterText = this.config.resultsText.one_result;
      } else {
        counterText = this.config.resultsText.many_results;
      }

      counterText = counterText
        .replace("[COUNT]", totalResults.toString())
        .replace("[SEARCH_TERM]", query);

      this.elements.resultsCounter.textContent = counterText;
    } else {
      this.elements.resultsCounter.textContent = "";
    }

    // Update results container
    if (error) {
      this.elements.resultsContainer.innerHTML = `
        <div class="px-4 py-8 text-center font-sans text-sm text-subtle">
          ${error}
        </div>
      `;
    } else if (isSearching) {
      this.elements.resultsContainer.innerHTML = this.renderLoadingSkeleton();
    } else if (results.length > 0) {
      this.elements.resultsContainer.innerHTML = results
        .map((result) => this.renderResultItem(result))
        .join("");
    } else if (hasSearched) {
      this.elements.resultsContainer.innerHTML = `
        <div class="px-4 py-8 text-center font-sans text-sm text-subtle">
          No results found. Try adjusting your search terms.
        </div>
      `;
    } else {
      this.elements.resultsContainer.innerHTML = "";
    }

    // Show/hide load more button
    const remainingResults = this.getRemainingResults();
    if (remainingResults.length > 0 && !isSearching) {
      this.elements.loadMoreWrapper.classList.remove("hidden");
      this.elements.loadMoreButton.textContent = `Load ${Math.min(
        remainingResults.length,
        this.config.pageSize,
      )} more (${totalResults - visibleResults} total)`;
    } else {
      this.elements.loadMoreWrapper.classList.add("hidden");
    }
  }

  /**
   * Set up DOM elements
   */
  private setupElements(): void {
    const container = document.querySelector("#pagefind__search");
    this.elements = container ? {
        clearButton: container.querySelector(
          ".pagefind-ui__search-clear",
        ) as HTMLButtonElement,
        container: container as HTMLElement,
        filtersContainer: container.querySelector(
          ".pagefind-ui__filters",
        ) as HTMLElement,
        input: container.querySelector(
          ".pagefind-ui__search-input",
        ) as HTMLInputElement,
        loadMoreButton: container.querySelector(
          ".pagefind-ui__button",
        ) as HTMLButtonElement,
        loadMoreWrapper: container.querySelector(
          ".pagefind-ui__results-footer",
        ) as HTMLElement,
        resultsContainer: container.querySelector(
          ".pagefind-ui__results",
        ) as HTMLElement,
        resultsCounter: container.querySelector(
          ".pagefind-ui__results-count",
        ) as HTMLElement,
      } : {
        clearButton: document.querySelector(
          "#pagefind-clear-button",
        ) as HTMLButtonElement,
        container: document.body,
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
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.updateState({
      error: message,
      isSearching: false,
    });
    this.renderResults();
  }

  private storeRemainingResults(results: PagefindResult[]): void {
    sessionStorage.setItem("pagefind-remaining", JSON.stringify(results));
  }

  /**
   * Update component state
   */
  private updateState(updates: Partial<SearchState>): void {
    this.state = { ...this.state, ...updates };
  }
}