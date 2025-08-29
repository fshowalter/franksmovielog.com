import type { KeyboardEvent } from "react";

import { useEffect, useRef, useState } from "react";

import { LabelText } from "~/components/LabelText";

export const DROPDOWN_CLOSE_DELAY_MS = 150;
export const SCROLL_DELAY_MS = 50;

// Positioning constants
const SPACE_BUFFER_ABOVE = 20;
const SPACE_BUFFER_BELOW = 10;

// Dropdown sizing based on items
const ITEM_HEIGHT = 40; // Approximate height of each dropdown item in pixels
const MIN_VISIBLE_ITEMS = 3;
const MAX_VISIBLE_ITEMS = 7;

// Helper to find the nearest fieldset parent
const findFieldsetParent = (
  element: HTMLElement | null,
): HTMLElement | undefined => {
  if (!element) return undefined;

  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    if (parent.tagName.toLowerCase() === "fieldset") {
      return parent;
    }
    parent = parent.parentElement;
  }
  return undefined;
};

// Helper to find the nearest scrollable container
const findScrollableContainer = (
  element: HTMLElement | null,
): HTMLElement | undefined => {
  if (!element) return undefined;

  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const style = globalThis.getComputedStyle(parent);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return parent;
    }
    parent = parent.parentElement;
  }
  return undefined;
};

// Calculate available space above and below the button
const calculateAvailableSpace = (
  buttonRect: DOMRect,
  fieldsetParent: HTMLElement | undefined,
) => {
  let effectiveSpaceBelow: number;
  let effectiveSpaceAbove: number;

  if (fieldsetParent) {
    // We're inside a fieldset - use its boundaries
    const fieldsetRect = fieldsetParent.getBoundingClientRect();
    effectiveSpaceBelow = fieldsetRect.bottom - buttonRect.bottom;
    effectiveSpaceAbove = buttonRect.top - fieldsetRect.top;
  } else {
    // No fieldset parent, use viewport
    const viewportHeight = window.innerHeight;
    effectiveSpaceBelow = viewportHeight - buttonRect.bottom;
    effectiveSpaceAbove = buttonRect.top;
  }

  // Add small buffer for visual spacing
  effectiveSpaceAbove -= SPACE_BUFFER_ABOVE;
  effectiveSpaceBelow -= SPACE_BUFFER_BELOW;

  return { effectiveSpaceAbove, effectiveSpaceBelow };
};

// Determine dropdown position and height based on available space
const determineDropdownLayout = (
  effectiveSpaceAbove: number,
  effectiveSpaceBelow: number,
  itemCount: number,
) => {
  // Calculate heights based on number of items
  const minDropdownHeight = MIN_VISIBLE_ITEMS * ITEM_HEIGHT;

  // Check if we can fit minimum items below
  if (effectiveSpaceBelow < minDropdownHeight) {
    // Can't fit minimum below, try above
    if (effectiveSpaceAbove >= minDropdownHeight) {
      // Open upward - fit as many items as possible up to max
      const itemsThatFit = Math.min(
        Math.floor(effectiveSpaceAbove / ITEM_HEIGHT),
        MAX_VISIBLE_ITEMS,
        itemCount,
      );
      const height = Math.max(MIN_VISIBLE_ITEMS, itemsThatFit) * ITEM_HEIGHT;
      return { height: `${height}px`, position: "above" as const };
    } else {
      // Can't fit minimum in either direction, use what space we have below
      const height = Math.max(effectiveSpaceBelow, ITEM_HEIGHT);
      return { height: `${height}px`, position: "below" as const };
    }
  } else {
    // Can fit at least minimum below, use as much space as we can
    const itemsThatFit = Math.min(
      Math.floor(effectiveSpaceBelow / ITEM_HEIGHT),
      MAX_VISIBLE_ITEMS,
      itemCount,
    );
    const height = Math.max(MIN_VISIBLE_ITEMS, itemsThatFit) * ITEM_HEIGHT;
    return { height: `${height}px`, position: "below" as const };
  }
};

export function MultiSelectField({
  initialValues,
  label,
  onChange,
  options,
}: {
  initialValues: string[];
  label: string;
  onChange: (values: string[]) => void;
  options: readonly string[];
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialValues || [],
  );
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
    if (!isOpen) {
      // Calculate position BEFORE opening to prevent flash
      calculateDropdownPositionAndHeight();
      // Reset highlighted index when opening
      setHighlightedIndex(0);
    }
    setIsOpen(!isOpen);
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

    // Scroll to keep control in view if removing items might cause layout shift
    if (buttonRef.current) {
      const timeoutId = setTimeout(() => {
        buttonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        timeoutRefs.current.delete(timeoutId);
      }, SCROLL_DELAY_MS);
      timeoutRefs.current.add(timeoutId);
    }
  };

  const clearAll = () => {
    setSelectedOptions([]);
    onChange([]);
    buttonRef.current?.focus();

    // Scroll to keep control in view after clearing
    if (buttonRef.current) {
      const timeoutId = setTimeout(() => {
        buttonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        timeoutRefs.current.delete(timeoutId);
      }, SCROLL_DELAY_MS);
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
  // AIDEV-NOTE: Dropdown positioning logic - opens upward when there's more space above
  // and the space below is insufficient for the minimum number of items
  const calculateDropdownPositionAndHeight = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const fieldsetParent = findFieldsetParent(buttonRef.current);

    const { effectiveSpaceAbove, effectiveSpaceBelow } =
      calculateAvailableSpace(buttonRect, fieldsetParent);

    const { height, position } = determineDropdownLayout(
      effectiveSpaceAbove,
      effectiveSpaceBelow,
      availableOptions.length,
    );

    setDropdownPosition(position);
    setDropdownMaxHeight(height);
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

  // Recalculate position when available options change
  useEffect(() => {
    if (isOpen) {
      calculateDropdownPositionAndHeight();
    }
  }, [availableOptions.length]);

  // Add resize and scroll listeners with debouncing
  useEffect(() => {
    if (!isOpen) return;

    let debounceTimer: NodeJS.Timeout | undefined;

    const debouncedCalculate = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        calculateDropdownPositionAndHeight();
        debounceTimer = undefined;
      }, 16); // ~60fps
    };

    const handleResize = () => {
      debouncedCalculate();
    };

    const handleScroll = () => {
      debouncedCalculate();
    };

    if (globalThis.window !== undefined) {
      window.addEventListener("resize", handleResize);

      // Find and listen to scrollable container
      const scrollableContainer = findScrollableContainer(buttonRef.current);

      if (scrollableContainer) {
        scrollableContainer.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
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
                  : "top-full mt-1"
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
