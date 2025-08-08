import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { JSDOM } from "jsdom";
import * as ts from "typescript";
import { afterEach, beforeEach, describe, it } from "vitest";

describe("Layout navigation menu", () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window;
  let cleanup: () => void;

  beforeEach(async () => {
    // Render the test page using Astro's container API
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });

    // Import our test page that uses the Layout
    const { default: TestPage } = await import("./TestPage.astro");

    const result = await container.renderToString(
      TestPage as AstroComponentFactory,
      {
        partial: false,
        request: new Request(`https://www.franksmovielog.com/test`),
      },
    );

    // Create JSDOM instance with the rendered HTML
    dom = new JSDOM(result, {
      url: "https://www.franksmovielog.com/test",
      runScripts: "dangerously", // Execute inline scripts
      pretendToBeVisual: true, // Provides requestAnimationFrame and other browser APIs
    });

    document = dom.window.document;
    window = dom.window as unknown as Window;

    // Make JSDOM's window and document available globally for testing-library
    global.window = window;
    global.document = document;
    // Navigator is read-only in Node, so we need to define it differently
    Object.defineProperty(global, 'navigator', {
      value: window.navigator,
      writable: true,
      configurable: true,
    });

    // Since the container API doesn't bundle scripts, we need to manually inject the navMenu script
    // Read and transpile the navMenu.ts file using TypeScript's transpile API
    const navMenuPath = fileURLToPath(new URL('./navMenu.ts', import.meta.url));
    const navMenuContent = readFileSync(navMenuPath, 'utf-8');
    
    // Use TypeScript to transpile to JavaScript
    const transpileResult = ts.transpileModule(navMenuContent, {
      compilerOptions: {
        module: ts.ModuleKind.None,
        target: ts.ScriptTarget.ES2020,
        removeComments: true,
      },
    });

    // Execute the transpiled navMenu script in the JSDOM context
    const scriptEl = dom.window.document.createElement('script');
    scriptEl.textContent = transpileResult.outputText;
    dom.window.document.body.appendChild(scriptEl);

    cleanup = () => {
      // Clean up body classes
      if (document?.body) {
        document.body.classList.remove("nav-open");
      }
    };
  });

  afterEach(() => {
    cleanup();
    dom.window.close();
  });

  it("renders navigation toggle button", ({ expect }) => {
    const toggleButton = document.querySelector("[data-nav-toggle]");
    expect(toggleButton).toBeTruthy();
    expect(toggleButton?.getAttribute("aria-label")).toBe(
      "Toggle navigation menu",
    );
    expect(toggleButton?.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders navigation menu", ({ expect }) => {
    const navMenu = document.querySelector("[data-nav-menu]");
    expect(navMenu).toBeTruthy();
    // The aria-label is on the parent nav element, not the ul with data-nav-menu
    const navElement = navMenu?.closest('nav');
    expect(navElement?.getAttribute("aria-label")).toBe("Main navigation");
  });

  it("opens and closes navigation menu on toggle button click", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const body = document.body;

    // Initially closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("true");

    // Close menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu when clicking a navigation link", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Click a navigation link
    const navLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    expect(navLink).toBeTruthy();
    navLink.click();

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu when clicking backdrop", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const backdrop = document.querySelector(
      "[data-nav-backdrop]",
    ) as HTMLElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Click backdrop
    backdrop.click();

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu when clicking outside", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Create a click event on the body but outside the menu
    const clickEvent = new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    
    // Find an element that's outside the nav menu and toggle button
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.dispatchEvent(clickEvent);
    } else {
      body.dispatchEvent(clickEvent);
    }

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu on Escape key", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const body = document.body;

    // Open menu
    toggleButton.click();
    expect(body.classList.contains("nav-open")).toBe(true);

    // Press Escape
    const event = new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    document.dispatchEvent(event);

    // Menu should be closed
    expect(body.classList.contains("nav-open")).toBe(false);
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("focuses first link when opening menu", async ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;

    // Open menu
    toggleButton.click();

    // Wait for next frame (requestAnimationFrame)
    await new Promise((resolve) => window.requestAnimationFrame(resolve));

    // First link should be focused
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    expect(document.activeElement).toBe(firstLink);
  });

  it("returns focus to toggle button on Escape", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;

    // Open menu
    toggleButton.click();
    expect(document.body.classList.contains("nav-open")).toBe(true);

    // Move focus elsewhere first
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    firstLink.focus();

    // Press Escape
    const event = new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    document.dispatchEvent(event);

    // Toggle button should be focused
    expect(document.activeElement).toBe(toggleButton);
  });

  it("traps focus within menu when open - Tab from toggle button", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;

    // Open menu
    toggleButton.click();

    // Focus is on toggle button
    toggleButton.focus();
    expect(document.activeElement).toBe(toggleButton);

    // Simulate Tab key - the handler should prevent default and move focus
    const tabEvent = new window.KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    
    // The event handler will prevent default and move focus
    const defaultPrevented = !document.dispatchEvent(tabEvent);
    
    // Check that default was prevented
    expect(defaultPrevented).toBe(true);
    
    // First menu item should be focused
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    expect(document.activeElement).toBe(firstLink);
  });

  it("traps focus within menu when open - Shift+Tab from first element", ({ expect }) => {
    const toggleButton = document.querySelector(
      "[data-nav-toggle]",
    ) as HTMLButtonElement;
    const navMenu = document.querySelector("[data-nav-menu]") as HTMLElement;

    // Open menu
    toggleButton.click();

    // Focus first link
    const firstLink = navMenu.querySelector("a[href]") as HTMLAnchorElement;
    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);

    // Simulate Shift+Tab
    const shiftTabEvent = new window.KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    
    // The event handler will prevent default and move focus
    const defaultPrevented = !document.dispatchEvent(shiftTabEvent);
    
    // Check that default was prevented
    expect(defaultPrevented).toBe(true);
    
    // Toggle button should be focused
    expect(document.activeElement).toBe(toggleButton);
  });
});