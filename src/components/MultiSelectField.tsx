import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { LabelText } from "~/components/LabelText";

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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
  const listboxId = `listbox-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const buttonId = `button-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const availableOptions = options.filter(
    (option) => !selectedOptions.includes(option)
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
    setTimeout(() => {
      setIsOpen(false);
      buttonRef.current?.focus();
    }, 150);
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
    if (window.innerWidth >= 1024 && buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  };

  const clearAll = () => {
    setSelectedOptions([]);
    onChange([]);
    buttonRef.current?.focus();
    
    // On desktop, scroll to keep control in view after clearing
    if (window.innerWidth >= 1024 && buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  };

  // Handle keyboard navigation on the button
  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleToggle();
        break;
    }
  };

  // Handle keyboard navigation in the listbox
  const handleListboxKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < availableOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(availableOptions.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < availableOptions.length) {
          handleSelect(availableOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        // Allow tab to close the dropdown and move focus naturally
        setIsOpen(false);
        break;
    }
  };

  // Calculate available space when dropdown opens
  const calculateDropdownHeight = () => {
    const isMobileDrawer = window.innerWidth < 1024;

    if (isMobileDrawer && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const footerHeight = 100;
      const availableSpace = viewportHeight - buttonRect.bottom - footerHeight;
      const minHeight = 120;
      const maxHeight = 300;

      if (availableSpace < minHeight) {
        setDropdownMaxHeight(`${Math.max(availableSpace, 80)}px`);
      } else {
        setDropdownMaxHeight(`${Math.min(availableSpace, maxHeight)}px`);
      }
    } else {
      setDropdownMaxHeight("15rem");
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
      // Check if scrollIntoView exists (it doesn't in jsdom test environment)
      if (typeof optionsRef.current[highlightedIndex]?.scrollIntoView === 'function') {
        optionsRef.current[highlightedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
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
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Calculate dropdown height when it opens
  useEffect(() => {
    if (isOpen) {
      calculateDropdownHeight();
    }
  }, [isOpen]);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownHeight();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

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
          ref={buttonRef}
          id={buttonId}
          type="button"
          className={`
            relative w-full cursor-default
            scroll-mt-[var(--control-scroll-offset,0)] rounded border
            border-default bg-default pr-10 pl-3 text-left text-base
            text-subtle
            focus:border-[rgb(38,132,255)]
            focus:shadow-[0px_0px_0px_1px_rgb(38,132,255)]
            focus:outline-none
          `}
          onClick={handleToggle}
          onKeyDown={handleButtonKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0 
              ? getOptionId(highlightedIndex)
              : undefined
          }
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
                  key={option}
                  className={`
                    inline-flex items-center gap-1 rounded bg-canvas
                    px-2 py-0.5 text-sm text-default
                  `}
                >
                  <span>{option}</span>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Remove ${option}`}
                    className={`
                      -mr-1 ml-0.5 cursor-pointer text-subtle
                      hover:text-accent focus:text-accent
                      focus:outline-none
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
                  >
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))
            )}
          </div>
          <span
            className={`
              absolute top-1/2 right-0 flex -translate-y-1/2
              items-center pr-2
            `}
          >
            {selectedOptions.length > 0 && (
              <>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Clear all selections"
                  className={`
                    cursor-pointer p-1 text-subtle
                    hover:text-accent focus:text-accent
                    focus:outline-none
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
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="mx-1 h-5 border-l border-default" aria-hidden="true" />
              </>
            )}
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-subtle pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`
              absolute z-10 mt-1 w-full overflow-auto rounded-sm
              bg-default py-1 text-base text-subtle
              shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1),0px_4px_11px_rgba(0,0,0,0.1)]
              focus:outline-none
            `}
            style={{ maxHeight: dropdownMaxHeight }}
            onKeyDown={handleListboxKeyDown}
          >
            <ul
              id={listboxId}
              role="listbox"
              aria-labelledby={`label-${buttonId}`}
              aria-multiselectable="true"
              tabIndex={-1}
            >
              {availableOptions.length === 0 ? (
                <li className="py-2 px-4 text-subtle italic">
                  No options available
                </li>
              ) : (
                availableOptions.map((option, index) => (
                  <li
                    key={option}
                    ref={(el) => { optionsRef.current[index] = el; }}
                    id={getOptionId(index)}
                    role="option"
                    aria-selected={false}
                    className={`
                      relative cursor-pointer select-none py-2 px-4
                      ${highlightedIndex === index 
                        ? "bg-stripe text-default" 
                        : "hover:bg-stripe hover:text-subtle"}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
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