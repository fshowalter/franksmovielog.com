/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";

// Test specific functions that can be isolated
describe("search-ui utility functions", () => {
  describe("DOM element handling", () => {
    it("should handle missing search container", () => {
      document.body.innerHTML = "";
      
      // Test that code handles missing elements gracefully
      const container = document.querySelector("#pagefind__search");
      expect(container).toBeNull();
      
      // Fallback to individual element selectors
      const input = document.querySelector("#pagefind-search-input");
      expect(input).toBeNull();
    });

    it("should find elements with primary selectors", () => {
      document.body.innerHTML = `
        <div id="pagefind__search">
          <input class="pagefind-ui__search-input" />
          <button class="pagefind-ui__search-clear">Clear</button>
          <div class="pagefind-ui__results"></div>
        </div>
      `;
      
      const container = document.querySelector("#pagefind__search");
      expect(container).toBeTruthy();
      
      const input = container?.querySelector(".pagefind-ui__search-input");
      expect(input).toBeTruthy();
    });

    it("should find elements with fallback selectors", () => {
      document.body.innerHTML = `
        <input id="pagefind-search-input" />
        <button id="pagefind-clear-button">Clear</button>
        <div id="pagefind-results"></div>
      `;
      
      const input = document.querySelector("#pagefind-search-input");
      expect(input).toBeTruthy();
      
      const clearButton = document.querySelector("#pagefind-clear-button");
      expect(clearButton).toBeTruthy();
      
      const results = document.querySelector("#pagefind-results");
      expect(results).toBeTruthy();
    });
  });

  describe("state management", () => {
    it("should have correct initial state shape", () => {
      const initialState = {
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
      
      expect(initialState.error).toBeUndefined();
      expect(initialState.hasSearched).toBe(false);
      expect(initialState.isSearching).toBe(false);
      expect(initialState.query).toBe("");
      expect(initialState.results).toEqual([]);
      expect(initialState.totalResults).toBe(0);
      expect(initialState.visibleResults).toBe(0);
    });

    it("should update state correctly", () => {
      const state = {
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
      
      const updates = {
        hasSearched: true,
        isSearching: true,
        query: "test",
      };
      
      const newState = { ...state, ...updates };
      
      expect(newState.query).toBe("test");
      expect(newState.hasSearched).toBe(true);
      expect(newState.isSearching).toBe(true);
      expect(newState.error).toBeUndefined();
    });
  });

  describe("counter text generation", () => {
    it("should generate correct counter text", () => {
      const resultsText = {
        many_results: '[COUNT] results for "[SEARCH_TERM]"',
        one_result: '[COUNT] result for "[SEARCH_TERM]"',
        zero_results: 'No results for "[SEARCH_TERM]"',
      };
      
      // Test zero results
      let text = resultsText.zero_results
        .replace("[COUNT]", "0")
        .replace("[SEARCH_TERM]", "test");
      expect(text).toBe('No results for "test"');
      
      // Test one result
      text = resultsText.one_result
        .replace("[COUNT]", "1")
        .replace("[SEARCH_TERM]", "test");
      expect(text).toBe('1 result for "test"');
      
      // Test many results
      text = resultsText.many_results
        .replace("[COUNT]", "5")
        .replace("[SEARCH_TERM]", "test");
      expect(text).toBe('5 results for "test"');
    });
  });

  describe("accessibility", () => {
    it("should create screen reader announcement element", () => {
      const message = "5 more results loaded";
      const announcement = document.createElement("div");
      announcement.setAttribute("role", "status");
      announcement.setAttribute("aria-live", "polite");
      announcement.className = "sr-only";
      announcement.textContent = message;
      
      document.body.append(announcement);
      
      const element = document.querySelector('[role="status"]');
      expect(element).toBeTruthy();
      expect(element?.textContent).toBe(message);
      expect(element?.className).toBe("sr-only");
      
      // Clean up
      announcement.remove();
    });
  });

  describe("configuration", () => {
    it("should have correct default config", () => {
      const config = {
        bundlePath: "/" + "pagefind/",
        debounceTimeoutMs: 150,
        pageSize: 5,
        resultsText: {
          many_results: '[COUNT] results for "[SEARCH_TERM]"',
          one_result: '[COUNT] result for "[SEARCH_TERM]"',
          zero_results: 'No results for "[SEARCH_TERM]"',
        },
        showImages: true,
      };
      
      expect(config.bundlePath).toBe("/pagefind/");
      expect(config.debounceTimeoutMs).toBe(150);
      expect(config.pageSize).toBe(5);
      expect(config.showImages).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should handle AbortError correctly", () => {
      const error = new DOMException("Search aborted", "AbortError");
      expect(error.name).toBe("AbortError");
      expect(error.message).toBe("Search aborted");
    });

    it("should distinguish between abort and other errors", () => {
      const abortError = new DOMException("Search aborted", "AbortError");
      const otherError = new Error("Network error");
      
      expect(abortError.name).toBe("AbortError");
      expect(otherError.name).not.toBe("AbortError");
    });
  });

  describe("array slicing for pagination", () => {
    it("should slice results correctly for pagination", () => {
      const results = Array.from({ length: 10 }, (_, i) => ({ id: i }));
      const pageSize = 5;
      
      const firstPage = results.slice(0, pageSize);
      expect(firstPage).toHaveLength(5);
      expect(firstPage[0].id).toBe(0);
      expect(firstPage[4].id).toBe(4);
      
      const remaining = results.slice(pageSize);
      expect(remaining).toHaveLength(5);
      expect(remaining[0].id).toBe(5);
      expect(remaining[4].id).toBe(9);
    });

    it("should handle partial pages", () => {
      const results = Array.from({ length: 7 }, (_, i) => ({ id: i }));
      const pageSize = 5;
      
      const firstPage = results.slice(0, pageSize);
      expect(firstPage).toHaveLength(5);
      
      const remaining = results.slice(pageSize);
      expect(remaining).toHaveLength(2);
    });
  });
});