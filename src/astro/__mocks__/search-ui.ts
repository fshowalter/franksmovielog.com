import type { PagefindAPI, PagefindResult } from "~/astro/search-ui";

import { debounce } from "~/utils/debounce";

// Mock SearchUI that works with our mocked pagefind API
export class SearchUI {
  private abortController: AbortController | undefined = undefined;
  private allResults: PagefindResult[] = [];
  private api: PagefindAPI | undefined = undefined;
  private clearButton: HTMLButtonElement | undefined = undefined;
  private container: HTMLElement | undefined = undefined;
  private readonly debouncedSearch: (query: string) => void;
  private displayedResults = 0;
  private initialized = false;
  private input: HTMLInputElement | undefined = undefined;
  private loadMoreButton: HTMLButtonElement | undefined = undefined;
  private loadMoreWrapper: HTMLElement | undefined = undefined;
  private resultsContainer: HTMLElement | undefined = undefined;
  private resultsCounter: HTMLElement | undefined = undefined;

  constructor() {
    // Create debounced search function
    this.debouncedSearch = debounce((query: string) => {
      void this.handleSearch(query);
    }, 150);
  }

  async destroy(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort();
    }
    if (this.api && typeof this.api === "object" && "destroy" in this.api) {
      await this.api.destroy();
    }
    this.initialized = false;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    // Get DOM elements - look for the actual IDs in AstroPageShell
    this.input = document.querySelector("#pagefind-search-input");
    this.clearButton = document.querySelector("#pagefind-clear-button");
    this.resultsContainer = document.querySelector("#pagefind-results");
    this.resultsCounter = document.querySelector("#pagefind-results-counter");
    this.loadMoreWrapper = document.querySelector("#pagefind-load-more-wrapper");
    this.loadMoreButton = document.querySelector("#pagefind-load-more");

    // Import mocked pagefind module
    const pagefindModule = (await import(
      "/pagefind/pagefind.js"
    )) as PagefindAPI;
    this.api = pagefindModule;

    if (this.api && typeof this.api === "object" && "init" in this.api) {
      await this.api.init();
    }

    // Set up event listeners
    if (this.input) {
      this.input.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        this.debouncedSearch(target.value);
      });
    }

    if (this.clearButton) {
      this.clearButton.addEventListener("click", () => {
        this.clearSearch();
      });
    }

    if (this.loadMoreButton) {
      this.loadMoreButton.addEventListener("click", () => {
        void this.loadMoreResults();
      });
    }

    this.initialized = true;
  }

  private clearSearch(): void {
    if (this.input) {
      this.input.value = "";
    }
    if (this.clearButton) {
      this.clearButton.classList.add("hidden");
    }
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = "";
    }
    if (this.resultsCounter) {
      this.resultsCounter.textContent = "";
    }
    if (this.loadMoreWrapper) {
      this.loadMoreWrapper.classList.add("hidden");
    }
    this.allResults = [];
    this.displayedResults = 0;

    // Focus input when clearing
    if (this.input) {
      this.input.focus();
    }
  }

  private getLoadingSkeleton(): string {
    return `
      <div class="animate-pulse">
        <div class="bg-subtle h-20 mb-4 rounded"></div>
        <div class="bg-subtle h-20 mb-4 rounded"></div>
        <div class="bg-subtle h-20 mb-4 rounded"></div>
      </div>
    `;
  }

  private async handleSearch(query: string): Promise<void> {
    // Cancel any pending search
    if (this.abortController) {
      this.abortController.abort();
    }

    const trimmedQuery = query.trim();

    // Update clear button visibility
    if (this.clearButton) {
      this.clearButton.classList.toggle("hidden", !trimmedQuery);
    }

    if (!trimmedQuery) {
      this.clearSearch();
      return;
    }

    // Create new abort controller for this search
    this.abortController = new AbortController();

    // Show loading skeleton
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = this.getLoadingSkeleton();
    }

    try {
      // Use the mocked debouncedSearch
      const searchResults = await this.api!.debouncedSearch(trimmedQuery);

      if (this.abortController.signal.aborted) {
        return;
      }

      this.allResults = searchResults.results || [];
      this.displayedResults = 0;

      // Update results counter
      if (this.resultsCounter) {
        const count = searchResults.unfilteredResultCount || 0;
        if (count === 0) {
          this.resultsCounter.textContent = `No results for "${trimmedQuery}"`;
        } else if (count === 1) {
          this.resultsCounter.textContent = `1 result for "${trimmedQuery}"`;
        } else {
          this.resultsCounter.textContent = `${count} results for "${trimmedQuery}"`;
        }
      }

      // Render initial results
      await this.renderResults();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        return; // Search was cancelled, ignore
      }
      console.error("Search failed:", error);
      if (this.resultsContainer) {
        this.resultsContainer.innerHTML = `
          <div class="text-muted">
            Search failed. Please try again.
          </div>
        `;
      }
    }
  }

  private async loadMoreResults(): Promise<void> {
    await this.renderResults();
  }

  private async renderResults(): Promise<void> {
    if (!this.resultsContainer) return;

    const resultsToShow = 5;
    const nextBatch = this.allResults.slice(
      this.displayedResults,
      this.displayedResults + resultsToShow,
    );

    if (this.displayedResults === 0) {
      // First render, replace skeleton
      this.resultsContainer.innerHTML = "";
    }

    if (nextBatch.length === 0 && this.displayedResults === 0) {
      this.resultsContainer.innerHTML = `
        <div class="text-muted">
          No results found. Try adjusting your search terms.
        </div>
      `;
      if (this.loadMoreWrapper) {
        this.loadMoreWrapper.classList.add("hidden");
      }
      return;
    }

    // Render results
    for (const result of nextBatch) {
      const data = await result.data();
      const resultHtml = `
        <div class="search-result">
          ${data.meta.image ? `<img src="${data.meta.image}" alt="${data.meta.image_alt || ""}" />` : ""}
          <div>
            <a href="${data.url}">${data.meta.title}</a>
            <p>${data.excerpt}</p>
          </div>
        </div>
      `;
      this.resultsContainer.insertAdjacentHTML("beforeend", resultHtml);
    }

    this.displayedResults += nextBatch.length;

    // Update load more button
    if (this.loadMoreWrapper && this.loadMoreButton) {
      const remaining = this.allResults.length - this.displayedResults;
      if (remaining > 0) {
        const nextCount = Math.min(remaining, resultsToShow);
        this.loadMoreButton.textContent = `Load ${nextCount} more (${remaining} total)`;
        this.loadMoreWrapper.classList.remove("hidden");
      } else {
        this.loadMoreWrapper.classList.add("hidden");
      }
    }
  }
}
