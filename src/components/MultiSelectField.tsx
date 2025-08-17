import type { KeyboardEvent } from "react";

import { useEffect, useRef, useState } from "react";

import { LabelText } from "~/components/LabelText";

export const DROPDOWN_CLOSE_DELAY_MS = 150;

export function MultiSelectField({
  label,
  onChange,
  options,
}: {
  label: string;
  onChange: (values: string[]) => void;
  options: readonly string[];
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState("15rem");
  const [dropdownPosition, setDropdownPosition] = useState<"above" | "below">(
    "below",
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set());
  const listboxId = `listbox-${label.toLowerCase().replaceAll(/\s+/g, "-")}`;
  const buttonId = `button-${label.toLowerCase().replaceAll(/\s+/g, "-")}`;

  const availableOptions = options.filter(
    (option) => !selectedOptions.includes(option),
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset highlighted index when opening
      setHighlightedIndex(0);
    }
  };

  const handleSelect = (option: string) => {
    const newValues = [...selectedOptions, option];
    setSelectedOptions(newValues);
    onChange(newValues);

    // Reset highlighted index for remaining options
    setHighlightedIndex(0);

    // Close dropdown after selection
    const timeoutId = setTimeout(() => {
      setIsOpen(false);
      buttonRef.current?.focus();
      timeoutRefs.current.delete(timeoutId);
    }, DROPDOWN_CLOSE_DELAY_MS);
    timeoutRefs.current.add(timeoutId);
  };

  const removeOption = (optionToRemove: string, focusButton = true) => {
    const newValues = selectedOptions.filter((o) => o !== optionToRemove);
    setSelectedOptions(newValues);
    onChange(newValues);

    // Return focus to button after removal
    if (focusButton && buttonRef.current) {
      buttonRef.current.focus();
    }

    // On desktop, scroll to keep control in view if removing items might cause layout shift
    if (
      globalThis.window !== undefined &&
      window.innerWidth >= 1024 &&
      buttonRef.current
    ) {
      const timeoutId = setTimeout(() => {
        buttonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        timeoutRefs.current.delete(timeoutId);
      }, 50);
      timeoutRefs.current.add(timeoutId);
    }
  };

  const clearAll = () => {
    setSelectedOptions([]);
    onChange([]);
    buttonRef.current?.focus();

    // On desktop, scroll to keep control in view after clearing
    if (
      globalThis.window !== undefined &&
      window.innerWidth >= 1024 &&
      buttonRef.current
    ) {
      const timeoutId = setTimeout(() => {
        buttonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        timeoutRefs.current.delete(timeoutId);
      }, 50);
      timeoutRefs.current.add(timeoutId);
    }
  };

  // Handle keyboard navigation on the button
  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case " ":
      case "Enter": {
        e.preventDefault();
        handleToggle();
        break;
      }
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        break;
      }
    }
  };

  // Handle keyboard navigation in the listbox
  const handleListboxKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case " ":
      case "Enter": {
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < availableOptions.length
        ) {
          handleSelect(availableOptions[highlightedIndex]);
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < availableOptions.length - 1 ? prev + 1 : prev,
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      }
      case "End": {
        e.preventDefault();
        setHighlightedIndex(availableOptions.length - 1);
        break;
      }
      case "Escape": {
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      }
      case "Home": {
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      }
      case "Tab": {
        // Allow tab to close the dropdown and move focus naturally
        setIsOpen(false);
        break;
      }
    }
  };

  // Calculate available space and position when dropdown opens
  // AIDEV-NOTE: Dropdown positioning logic - opens upward when insufficient space below
  // Handles both viewport boundaries and scrollable container boundaries
  const calculateDropdownPositionAndHeight = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const isMobileDrawer = window.innerWidth < 1024;

    // Find the nearest scrollable container (if any)
    let scrollableContainer: HTMLElement | undefined;
    let element = buttonRef.current.parentElement;

    while (element && element !== document.body) {
      const style = globalThis.getComputedStyle(element);
      const overflowY = style.overflowY;

      if (overflowY === "auto" || overflowY === "scroll") {
        scrollableContainer = element;
        break;
      }
      element = element.parentElement;
    }

    // Calculate boundaries based on container or viewport
    let effectiveSpaceBelow: number;
    let effectiveSpaceAbove: number;

    if (scrollableContainer) {
      // We're inside a scrollable container
      const containerRect = scrollableContainer.getBoundingClientRect();

      // Space within the visible container area
      effectiveSpaceBelow = containerRect.bottom - buttonRect.bottom;
      effectiveSpaceAbove = buttonRect.top - containerRect.top;

      // Check for sticky footer within container
      const stickyFooter =
        scrollableContainer.querySelector(".z-filter-footer");
      if (stickyFooter) {
        const footerRect = stickyFooter.getBoundingClientRect();
        // If footer is visible, subtract its height from space below
        if (footerRect.top < containerRect.bottom) {
          effectiveSpaceBelow = Math.min(
            effectiveSpaceBelow,
            footerRect.top - buttonRect.bottom,
          );
        }
      }
    } else {
      // Not in a scrollable container, use viewport
      effectiveSpaceBelow = viewportHeight - buttonRect.bottom;
      effectiveSpaceAbove = buttonRect.top;

      // Account for footer in mobile drawer (non-scrollable case)
      const footerBuffer = isMobileDrawer ? 100 : 20;
      effectiveSpaceBelow -= footerBuffer;
    }

    // Add small buffer for visual spacing
    effectiveSpaceAbove -= 20;
    effectiveSpaceBelow -= 10;

    // Minimum height needed for a usable dropdown
    const minDropdownHeight = 120;
    const maxDropdownHeight = 300;

    // Determine position based on available space
    if (
      effectiveSpaceBelow < minDropdownHeight &&
      effectiveSpaceAbove > effectiveSpaceBelow
    ) {
      // Open upward if more space above
      setDropdownPosition("above");
      const height = Math.min(
        Math.max(effectiveSpaceAbove, 80),
        maxDropdownHeight,
      );
      setDropdownMaxHeight(`${height}px`);
    } else {
      // Default to opening below
      setDropdownPosition("below");
      const height = Math.min(
        Math.max(effectiveSpaceBelow, 80),
        maxDropdownHeight,
      );
      setDropdownMaxHeight(`${height}px`);
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (
      isOpen &&
      highlightedIndex >= 0 &&
      optionsRef.current[highlightedIndex] && // Check if scrollIntoView exists (it doesn't in jsdom test environment)
      typeof optionsRef.current[highlightedIndex]?.scrollIntoView === "function"
    ) {
      optionsRef.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex, isOpen]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => {
      if (typeof document !== "undefined") {
        document.addEventListener("mousedown", handleClickOutside);
      }
      timeoutRefs.current.delete(timer);
    }, 0);
    timeoutRefs.current.add(timer);

    return () => {
      clearTimeout(timer);
      timeoutRefs.current.delete(timer);
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isOpen]);

  // Calculate dropdown position and height when it opens
  useEffect(() => {
    if (isOpen) {
      calculateDropdownPositionAndHeight();
    }
  }, [isOpen]);

  // Add resize and scroll listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      calculateDropdownPositionAndHeight();
    };

    const handleScroll = () => {
      calculateDropdownPositionAndHeight();
    };

    if (globalThis.window !== undefined) {
      window.addEventListener("resize", handleResize);

      // Find and listen to scrollable container
      let scrollableContainer: HTMLElement | undefined;
      if (buttonRef.current) {
        let element = buttonRef.current.parentElement;
        while (element && element !== document.body) {
          const style = globalThis.getComputedStyle(element);
          if (style.overflowY === "auto" || style.overflowY === "scroll") {
            scrollableContainer = element;
            break;
          }
          element = element.parentElement;
        }
      }

      if (scrollableContainer) {
        scrollableContainer.addEventListener("scroll", handleScroll);
      }

      return () => {
        window.removeEventListener("resize", handleResize);
        if (scrollableContainer) {
          scrollableContainer.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [isOpen]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutRefs.current) clearTimeout(timeoutId);
      timeoutRefs.current.clear();
    };
  }, []);

  // Generate option ID for aria-activedescendant
  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  return (
    <div className="flex flex-col text-left text-subtle">
      <LabelText as="label" htmlFor={buttonId} value={label} />

      <div
        className="relative"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          aria-activedescendant={
            isOpen && highlightedIndex >= 0
              ? getOptionId(highlightedIndex)
              : undefined
          }
          aria-controls={isOpen ? listboxId : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          className={`
            relative w-full cursor-default
            scroll-mt-[var(--control-scroll-offset,0)] rounded border
            border-default bg-default pr-10 pl-3 text-left text-base text-subtle
            focus:border-[rgb(38,132,255)]
            focus:shadow-[0px_0px_0px_1px_rgb(38,132,255)] focus:outline-none
          `}
          id={buttonId}
          onClick={handleToggle}
          onKeyDown={handleButtonKeyDown}
          ref={buttonRef}
          type="button"
        >
          <div
            className={`
              flex min-h-[36px] flex-wrap items-center gap-1 py-2
              ${selectedOptions.length > 0 ? "pr-16" : "pr-10"}
            `}
          >
            {selectedOptions.length === 0 ? (
              <span className="text-subtle">Select...</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  className={`
                    inline-flex items-center gap-1 rounded bg-canvas px-2 py-0.5
                    text-sm text-default
                  `}
                  key={option}
                >
                  <span>{option}</span>
                  <span
                    aria-label={`Remove ${option}`}
                    className={`
                      -mr-1 ml-0.5 cursor-pointer text-subtle
                      hover:text-accent
                      focus:text-accent focus:outline-none
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeOption(option, false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        removeOption(option, false);
                      }
                    }}
                    role="button"
                    tabIndex={-1}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                </span>
              ))
            )}
          </div>
          <span
            className={`
              absolute top-1/2 right-0 flex -translate-y-1/2 items-center pr-2
            `}
          >
            {selectedOptions.length > 0 && (
              <>
                <span
                  aria-label="Clear all selections"
                  className={`
                    cursor-pointer p-1 text-subtle
                    hover:text-accent
                    focus:text-accent focus:outline-none
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearAll();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      clearAll();
                    }
                  }}
                  role="button"
                  tabIndex={-1}
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      fillRule="evenodd"
                    />
                  </svg>
                </span>
                <span
                  aria-hidden="true"
                  className={`mx-1 h-5 border-l border-default`}
                />
              </>
            )}
            <svg
              aria-hidden="true"
              className="pointer-events-none h-5 w-5 text-subtle"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div
            className={`
              absolute z-10 w-full overflow-auto rounded-sm bg-default py-1
              text-base text-subtle
              shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1),0px_4px_11px_rgba(0,0,0,0.1)]
              focus:outline-none
              ${
                dropdownPosition === "above"
                  ? "bottom-full mb-1"
                  : `
                top-full mt-1
              `
              }
            `}
            onKeyDown={handleListboxKeyDown}
            ref={dropdownRef}
            style={{ maxHeight: dropdownMaxHeight }}
          >
            <ul
              aria-labelledby={`label-${buttonId}`}
              aria-multiselectable="true"
              id={listboxId}
              role="listbox"
              tabIndex={-1}
            >
              {availableOptions.length === 0 ? (
                <li className="px-4 py-2 text-subtle italic">
                  No options available
                </li>
              ) : (
                availableOptions.map((option, index) => (
                  <li
                    aria-selected={false}
                    className={`
                      relative cursor-pointer px-4 py-2 select-none
                      ${
                        highlightedIndex === index
                          ? "bg-stripe text-default"
                          : "hover:bg-stripe hover:text-subtle"
                      }
                    `}
                    id={getOptionId(index)}
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    ref={(el) => {
                      optionsRef.current[index] = el;
                    }}
                    role="option"
                  >
                    <span className="block truncate">{option}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
