import { vi } from "vitest";

// Mock implementation that stubs out SearchAPI but keeps SearchUI functionality
// eslint-disable-next-line no-restricted-imports -- Mock needs to import the actual module
import type * as SearchUIModule from "../search-ui";

// Import the actual module to get the real SearchUI
const actual = await vi.importActual<typeof SearchUIModule>("../search-ui");

// Create a mock SearchAPI that doesn't require Pagefind
class MockSearchAPI {
  async destroy(): Promise<void> {
    // No-op
  }

  async init(): Promise<void> {
    // No-op - don't try to load Pagefind
  }

  search(): Promise<{ results: unknown[] }> {
    // Return empty results for testing
    return Promise.resolve({ results: [] });
  }
}

// Export the real SearchUI but with our mocked SearchAPI
export class SearchUI extends actual.SearchUI {
  constructor() {
    super();
    // Replace the API with our mock
    // @ts-expect-error - accessing private property for testing
    this.api = new MockSearchAPI();
  }
}
