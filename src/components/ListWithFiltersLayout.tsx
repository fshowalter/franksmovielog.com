import type { JSX, ReactNode } from "react";

import { useCallback, useEffect, useRef, useState } from "react";

import { Layout } from "./Layout";

type Props<T extends string> = {
  backdrop: React.ReactNode;
  className?: string;
  filters: React.ReactNode;
  list: React.ReactNode;
  listHeaderButtons?: React.ReactNode;
  mastGradient?: boolean;
  sortProps: SortProps<T>;
  subNav?: React.ReactNode;
  totalCount: number;
};

type SortProps<T extends string> = {
  currentSortValue: T;
  onSortChange: React.ChangeEventHandler<HTMLSelectElement>;
  sortOptions: React.ReactNode;
};

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

export function ListWithFiltersLayout<T extends string>({
  backdrop,
  className,
  filters,
  list,
  listHeaderButtons,
  mastGradient,
  sortProps,
  subNav,
  totalCount,
  ...rest
}: Props<T>): JSX.Element {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const onFilterClick = useCallback(
    (event: React.MouseEvent) => {
      const documentSize = window.innerWidth;
      const tabletLandscapeBreakpoint = Number.parseFloat(
        globalThis
          .getComputedStyle(document.body)
          .getPropertyValue("--breakpoint-tablet-landscape"),
      );

      if (documentSize >= tabletLandscapeBreakpoint) {
        setFilterDrawerVisible(false);
        event.preventDefault();

        // Scroll to the filters and focus first input
        document.querySelector("#filters")?.scrollIntoView();

        // Delay focus to allow smooth scroll to complete
        setTimeout(() => {
          const firstFocusable = filtersRef.current?.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          firstFocusable?.focus();
        }, 500); // Wait for scroll animation to complete

        return;
      }

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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        filterDrawerVisible &&
        filtersRef.current &&
        !filtersRef.current.contains(target) &&
        !toggleButtonRef.current?.contains(target)
      ) {
        setFilterDrawerVisible(false);
        document.body.classList.remove("overflow-hidden");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [filterDrawerVisible]);

  return (
    <Layout
      className={`
        bg-subtle
        ${className || ""}
      `}
      {...rest}
      addGradient={mastGradient}
    >
      {backdrop}
      {subNav && subNav}
      <div className={`group/list-with-filters mx-auto bg-subtle`}>
        <div
          className={`
            sticky top-[calc(0px_+_var(--scroll-offset,0px))] z-sticky
            scroll-mt-[calc(0px_+__var(--scroll-offset,0px))] border-b
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
            gap-x-[var(--container-padding)]
            tablet:px-container
            tablet-landscape:flex
          `}
        >
          <div
            className={`
              mx-auto max-w-[var(--breakpoint-desktop)] grow
              scroll-mt-[calc(181px_+_var(--scroll-offset,0))] pb-10
              tablet:scroll-mt-[calc(121px_+_var(--scroll-offset,0px))]
            `}
            id="list"
          >
            {list}
          </div>

          {/* Backdrop for mobile filters */}
          <div
            aria-hidden="true"
            className={`
              invisible fixed inset-0 bg-[rgba(0,0,0,.4)] opacity-0
              transition-opacity duration-200
              tablet-landscape:hidden
              ${
                filterDrawerVisible
                  ? `visible z-side-drawer-backdrop opacity-100`
                  : ""
              }
            `}
            onClick={() => setFilterDrawerVisible(false)}
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
              tablet-landscape:relative tablet-landscape:z-auto
              tablet-landscape:col-start-4 tablet-landscape:block
              tablet-landscape:w-auto tablet-landscape:max-w-unset
              tablet-landscape:min-w-[320px] tablet-landscape:transform-none
              tablet-landscape:scroll-mt-[calc(25px_+_var(--scroll-offset,0px))]
              tablet-landscape:bg-inherit tablet-landscape:py-24
              tablet-landscape:pb-12 tablet-landscape:drop-shadow-none
              laptop:w-[33%]
            `}
            id="filters"
            ref={filtersRef}
          >
            <div
              className={`
                flex h-full w-full flex-col text-sm
                tablet:pt-12 tablet:text-base
                tablet-landscape:h-auto tablet-landscape:overflow-visible
                tablet-landscape:bg-default tablet-landscape:px-container
                tablet-landscape:pt-0
                laptop:px-8
              `}
            >
              <fieldset
                className={`
                  flex grow flex-col gap-5 px-container pb-4
                  tablet:gap-8
                  tablet-landscape:mt-0 tablet-landscape:gap-12
                  tablet-landscape:px-0 tablet-landscape:py-10
                `}
              >
                <legend
                  className={`
                    mb-5 block w-full pt-4 pb-4 text-lg text-subtle
                    shadow-bottom
                    tablet-landscape:mb-0 tablet-landscape:pt-10
                    tablet-landscape:pb-8 tablet-landscape:font-sans
                    tablet-landscape:text-xxs tablet-landscape:font-semibold
                    tablet-landscape:tracking-wide tablet-landscape:uppercase
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
                  tablet-landscape:hidden
                `}
              >
                <button
                  className={`
                    flex w-full cursor-pointer items-center justify-center
                    gap-x-4 bg-footer px-4 py-3 font-sans text-xs text-nowrap
                    text-inverse uppercase
                    tablet-landscape:hidden
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
    </Layout>
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
