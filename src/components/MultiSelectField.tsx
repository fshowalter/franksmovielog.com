import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useEffect, useRef, useState } from "react";

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
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState("15rem"); // Default max-h-60
  const [listboxKey, setListboxKey] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectionMadeRef = useRef(false);

  const handleChange = (values: string[]) => {
    // Check if this is an addition (not a removal)
    if (values.length > selectedOptions.length) {
      selectionMadeRef.current = true;
    }
    setSelectedOptions(values);
    onChange(values);
    
    // Only close dropdown if we added an item
    if (selectionMadeRef.current) {
      setTimeout(() => {
        setListboxKey(prev => prev + 1);
        selectionMadeRef.current = false;
      }, 50); // Small delay to allow state to update
    }
  };

  const removeOption = (optionToRemove: string) => {
    const newValues = selectedOptions.filter((o) => o !== optionToRemove);
    setSelectedOptions(newValues);
    onChange(newValues);

    // On desktop, scroll to keep control in view if removing items might cause layout shift
    if (window.innerWidth >= 1024 && buttonRef.current) {
      // Small delay to allow DOM to update
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  };

  // Calculate available space when dropdown opens
  const calculateDropdownHeight = () => {
    // Check if we're in mobile/drawer mode
    const isMobileDrawer = window.innerWidth < 1024; // tablet-landscape breakpoint

    if (isMobileDrawer && buttonRef.current) {
      // Only adjust height in drawer mode
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Account for the footer button (approximately 80px) and some buffer
      const footerHeight = 100;
      const availableSpace = viewportHeight - buttonRect.bottom - footerHeight;

      // Ensure minimum usable height
      const minHeight = 120;
      const maxHeight = 300;

      if (availableSpace < minHeight) {
        // If very little space, just use what we have
        setDropdownMaxHeight(`${Math.max(availableSpace, 80)}px`);
      } else {
        // Use available space up to maxHeight
        setDropdownMaxHeight(`${Math.min(availableSpace, maxHeight)}px`);
      }
    } else {
      // Desktop mode - use default height (15rem = 240px)
      setDropdownMaxHeight("15rem");
    }
  };

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      // Only recalculate if a dropdown is potentially visible
      const listbox = buttonRef.current?.closest(
        '[data-headlessui-state*="open"]',
      );
      if (listbox) {
        calculateDropdownHeight();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col text-left text-subtle">
      <LabelText as="label" htmlFor={label} value={label} />

      <div
        className="relative"
        onClick={(e) => {
          // Prevent clicks within the listbox from bubbling up and closing the drawer
          e.stopPropagation();
        }}
      >
        <Listbox key={listboxKey} multiple onChange={handleChange} value={selectedOptions}>
          {({ open }) => {
            // Calculate dropdown height when it opens - using requestAnimationFrame to avoid React warning
            if (open) {
              requestAnimationFrame(() => {
                calculateDropdownHeight();
              });
            }

            return (
              <div className="relative">
                <ListboxButton
                  className={`
                    relative w-full cursor-default
                    scroll-mt-[var(--control-scroll-offset,0)] rounded border
                    border-default bg-default pr-10 pl-3 text-left text-base
                    text-subtle
                    focus:border-[rgb(38,132,255)]
                    focus:shadow-[0px_0px_0px_1px_rgb(38,132,255)]
                    focus:outline-none
                  `}
                  id={label}
                  ref={buttonRef}
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
                            inline-flex items-center gap-1 rounded bg-canvas
                            px-2 py-0.5 text-sm text-default
                          `}
                          key={option}
                        >
                          {option}
                          <span
                            aria-label={`Remove ${option}`}
                            className={`
                              -mr-1 ml-0.5 cursor-pointer text-subtle
                              hover:text-accent
                            `}
                            onClick={(e) => {
                              // First prevent the dropdown from opening
                              e.preventDefault();
                              e.stopPropagation();
                              // Then remove the item after a microtask to avoid focus issues
                              setTimeout(() => removeOption(option), 0);
                            }}
                            onMouseDown={(e) => {
                              // Prevent the button from receiving focus
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onPointerDown={(e) => {
                              // Also prevent pointer events
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            role="button"
                            tabIndex={-1}
                          >
                            <svg
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
                      absolute top-1/2 right-0 flex -translate-y-1/2
                      items-center pr-2
                    `}
                  >
                    {selectedOptions.length > 0 && (
                      <>
                        <span
                          aria-label="Clear all"
                          className={`
                            cursor-pointer p-1 text-subtle
                            hover:text-accent
                          `}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleChange([]);

                            // On desktop, scroll to keep control in view after clearing
                            if (
                              window.innerWidth >= 1024 &&
                              buttonRef.current
                            ) {
                              setTimeout(() => {
                                buttonRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "nearest",
                                });
                              }, 50);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          role="button"
                          tabIndex={-1}
                        >
                          <svg
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
                        <span className="mx-1 h-5 border-l border-default" />
                      </>
                    )}
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-subtle"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </span>
                </ListboxButton>

                <ListboxOptions
                  className={`
                    absolute z-10 mt-1 w-full overflow-auto rounded-sm
                    bg-default py-1 text-base text-subtle
                    shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1),0px_4px_11px_rgba(0,0,0,0.1)]
                    focus:outline-none
                  `}
                  style={{ maxHeight: dropdownMaxHeight }}
                >
                  {options
                    .filter((option) => !selectedOptions.includes(option))
                    .map((option) => (
                      <ListboxOption
                        className={({ focus }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            focus ? "bg-stripe text-subtle" : "text-subtle"
                          }`
                        }
                        key={option}
                        onClick={(e: React.MouseEvent) => {
                          // Stop propagation to prevent closing the filter drawer
                          e.stopPropagation();
                        }}
                        value={option}
                      >
                        <span className="block truncate">{option}</span>
                      </ListboxOption>
                    ))}
                </ListboxOptions>
              </div>
            );
          }}
        </Listbox>
      </div>
    </div>
  );
}
