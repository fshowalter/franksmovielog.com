import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import { vi } from "vitest";

// Configure React Testing Library for React 19
configure({
  // React 19 uses automatic batching and concurrent features
  // This ensures act() works properly with the new React version
  asyncUtilTimeout: 2000,
});

// Set global IS_REACT_ACT_ENVIRONMENT for React 19
// This is required for React 19's new act behavior
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock scrollIntoView which is not available in jsdom
// Only mock if Element is defined (jsdom environment)
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

vi.mock("src/api/data/utils/getContentPath");
