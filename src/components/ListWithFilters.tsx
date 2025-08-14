import type { JSX, ReactNode } from "react";

import { useCallback, useEffect, useRef, useState } from "react";

type Props<T extends string> = {
  className?: string;
  dynamicSubNav?: React.ReactNode;
  filters: React.ReactNode;
  list: React.ReactNode;
  listHeaderButtons?: React.ReactNode;
  sortProps: SortProps<T>;
  totalCount: number;
};

type SortProps<T extends string> = {
  currentSortValue: T;
  onSortChange: React.ChangeEventHandler<HTMLSelectElement>;
  sortOptions: React.ReactNode;
};

// This is used by pages directly, keep it exported
export function ListHeaderButton({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <div
      className={`
        flex items-start gap-x-4 bg-default text-nowrap text-accent uppercase
      `}
    >
      <a
        className={`
          block transform-gpu px-4 py-2 transition-all
          hover:scale-105 hover:bg-accent hover:text-inverse
        `}
        href={href}
      >
        {text}
      </a>
    </div>
  );
}

export function ListWithFilters<T extends string>({
  className,
  dynamicSubNav,
  filters,
  list,
  listHeaderButtons,
  sortProps,
  totalCount,
}: Props<T>): JSX.Element {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const onFilterClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (filterDrawerVisible) {
        document.body.classList.remove("overflow-hidden");
        setFilterDrawerVisible(false);
      } else {
        document.body.classList.add("overflow-hidden");
        setFilterDrawerVisible(true);
        // Focus first focusable element after drawer opens
        requestAnimationFrame(() => {
          const firstFocusable = filtersRef.current?.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          firstFocusable?.focus();
        });
      }
    },
    [filterDrawerVisible],
  );

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && filterDrawerVisible) {
        setFilterDrawerVisible(false);
        document.body.classList.remove("overflow-hidden");
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filterDrawerVisible]);

  return (
    <div
      className={`
        ${className || ""}
      `}
    >
      {dynamicSubNav}
      <div className={`group/list-with-filters mx-auto bg-subtle`}>
        <div
          className={`
            sticky top-[calc(0px_+_var(--scroll-offset,0px))] z-sticky
            scroll-mt-[calc(0px_+_var(--scroll-offset,0px))] border-b
            border-default bg-default text-xs
            tablet:col-span-full
          `}
        >
          <ListHeader
            filterDrawerVisible={filterDrawerVisible}
            listHeaderButtons={listHeaderButtons}
            onFilterClick={onFilterClick}
            sortProps={sortProps}
            toggleButtonRef={toggleButtonRef}
            totalCount={totalCount}
          />
        </div>
        <div
          className={`
            mx-auto max-w-[var(--breakpoint-desktop)]
            tablet:px-container
          `}
        >
          <div
            className={`
              mx-auto max-w-[var(--breakpoint-desktop)] grow
              scroll-mt-[calc(var(--list-scroll-offset)_+_var(--scroll-offset,0px))]
              pb-10
              [--list-scroll-offset:181px]
              tablet:[--list-scroll-offset:121px]
            `}
            id="list"
          >
            {list}
          </div>

          {/* Backdrop for filters */}
          <div
            aria-hidden="true"
            className={`
              invisible fixed inset-0 bg-[rgba(0,0,0,.4)] opacity-0
              transition-opacity duration-200
              ${
                filterDrawerVisible
                  ? `visible z-side-drawer-backdrop opacity-100`
                  : ""
              }
            `}
            onClick={() => {
              document.body.classList.remove("overflow-hidden");
              setFilterDrawerVisible(false);
            }}
          />

          <div
            aria-label="Filters"
            className={`
              fixed top-0 right-0 z-filter-drawer flex h-full max-w-[380px]
              flex-col items-start gap-y-5 bg-default text-left text-inverse
              duration-200 ease-in-out
              ${
                filterDrawerVisible
                  ? `
                    bottom-0 w-full transform-[translateX(0)] overflow-y-auto
                    drop-shadow-2xl
                  `
                  : `w-0 transform-[translateX(100%)] overflow-y-hidden`
              }
              tablet:gap-y-10
            `}
            id="filters"
            ref={filtersRef}
          >
            <div
              className={`
                flex h-full w-full flex-col text-sm
                tablet:pt-12 tablet:text-base
              `}
            >
              <fieldset
                className={`
                  mt-0 flex grow flex-col gap-5 px-container py-10
                  [--control-scroll-offset:calc(181px_+_var(--scroll-offset,0px))]
                  tablet:gap-8
                  tablet-landscape:grow-0 tablet-landscape:gap-12
                  tablet-landscape:px-12
                `}
              >
                <legend
                  className={`
                    block w-full pt-10 pb-8 font-sans text-lg text-xxs
                    font-semibold tracking-wide text-subtle uppercase
                    shadow-bottom
                  `}
                >
                  Filter
                </legend>
                {filters}
              </fieldset>
              <div
                className={`
                  sticky bottom-0 z-filter-footer mt-auto w-full self-end
                  border-t border-t-default bg-default px-8 py-4 drop-shadow-2xl
                  tablet-landscape:static tablet-landscape:bottom-auto
                  tablet-landscape:mt-0 tablet-landscape:self-auto
                  tablet-landscape:border-t-0 tablet-landscape:px-12
                  tablet-landscape:drop-shadow-none
                `}
              >
                <button
                  className={`
                    flex w-full cursor-pointer items-center justify-center
                    gap-x-4 bg-footer px-4 py-3 font-sans text-xs text-nowrap
                    text-inverse uppercase
                  `}
                  onClick={() => {
                    setFilterDrawerVisible(false);
                    document.body.classList.remove("overflow-hidden");
                    document.querySelector("#list")?.scrollIntoView();
                  }}
                  type="button"
                >
                  View {totalCount} Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListHeader<T extends string>({
  filterDrawerVisible,
  listHeaderButtons,
  onFilterClick,
  sortProps,
  toggleButtonRef,
  totalCount,
}: {
  filterDrawerVisible: boolean;
  listHeaderButtons?: ReactNode;
  onFilterClick: (event: React.MouseEvent) => void;
  sortProps: SortProps<T>;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
  totalCount: number;
}): JSX.Element {
  const { currentSortValue, onSortChange, sortOptions } = sortProps;

  return (
    <div
      className={`
        mx-auto grid max-w-[var(--breakpoint-desktop)]
        grid-cols-[auto_auto_1fr_auto] items-baseline gap-y-7 px-container py-10
        font-sans font-medium tracking-wide text-subtle uppercase
        tablet:grid-cols-[auto_auto_1fr_auto_auto] tablet:gap-x-4
        tablet-landscape:grid-cols-[auto_auto_1fr_minmax(302px,calc(33%_-_192px))_auto]
        desktop:grid-cols-[auto_auto_1fr_calc(33%_-_96px)_auto]
      `}
    >
      <span className={`text-nowrap`}>
        <span className={`font-semibold text-default`}>
          {totalCount.toLocaleString()}
        </span>
        <span className="text-xxs leading-none tracking-wide"> Results</span>
      </span>
      <div className={``}>{listHeaderButtons && listHeaderButtons}</div>
      <div
        className={`
          col-span-full
          tablet:col-span-1 tablet:col-start-4
          desktop:pl-8
        `}
      >
        <label
          className={`
            flex items-baseline gap-x-4 text-xxs font-semibold tracking-wide
            text-subtle
          `}
        >
          Sort{" "}
          <select
            className={`
              flex w-full appearance-none border-none bg-default py-2 pr-4 pl-4
              font-serif text-base font-normal tracking-normal overflow-ellipsis
              text-default shadow-all outline-accent
            `}
            onChange={onSortChange}
            value={currentSortValue}
          >
            {sortOptions}
          </select>
        </label>
      </div>
      <button
        aria-controls="filters"
        aria-expanded={filterDrawerVisible}
        aria-label="Toggle filters"
        className={`
          col-start-4 row-start-1 flex transform-gpu cursor-pointer items-center
          justify-center gap-x-4 bg-canvas px-4 py-2 text-nowrap text-muted
          uppercase shadow-all transition-transform
          hover:scale-110
          tablet:col-start-5 tablet:w-20
        `}
        onClick={onFilterClick}
        ref={toggleButtonRef}
        type="button"
      >
        Filter
      </button>
    </div>
  );
}
