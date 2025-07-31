import type { JSX, ReactNode } from "react";

import { useState } from "react";

import { Layout } from "./Layout";

type Props<T extends string> = {
  backdrop: React.ReactNode;
  className?: string;
  filters: React.ReactNode;
  headerClasses?: string;
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
  headerClasses,
  list,
  listHeaderButtons,
  mastGradient,
  sortProps,
  subNav,
  totalCount,
  ...rest
}: Props<T>): JSX.Element {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  const onFilterClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    const documentSize = document.documentElement.clientWidth;
    const tabletLandscapeBreakpoint = Number.parseFloat(
      globalThis
        .getComputedStyle(document.body)
        .getPropertyValue("--breakpoint-tablet-landscape"),
    );

    if (documentSize >= tabletLandscapeBreakpoint) {
      setFilterDrawerVisible(false);
      return event;
    }

    event.preventDefault();
    document.body.classList.toggle("overflow-hidden");
    setFilterDrawerVisible(!filterDrawerVisible);
  };

  const onCloseFiltersClick: React.MouseEventHandler<
    HTMLAnchorElement
  > = () => {
    setFilterDrawerVisible(false);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <Layout
      className={className || "bg-subtle"}
      {...rest}
      addGradient={mastGradient}
    >
      {backdrop}
      {subNav && subNav}
      <div
        className={`
          group/list-with-filters mx-auto grid bg-subtle
          tablet:grid-cols-[var(--container-padding)_1fr_var(--container-padding)]
          tablet-landscape:grid-cols-[var(--container-padding)_1fr_var(--container-padding)_minmax(398px,calc(33%_-_96px))_var(--container-padding)]
        `}
      >
        <div
          className={`
            sticky top-0 z-10 border-b border-default bg-default text-xs
            tablet:col-span-full
            ${headerClasses ?? ""}
          `}
        >
          <input
            checked={filterDrawerVisible}
            className="hidden"
            data-drawer
            id="hiddenState"
            type="checkbox"
          />
          <ListHeader
            listHeaderButtons={listHeaderButtons}
            onFilterClick={onFilterClick}
            sortProps={sortProps}
            totalCount={totalCount}
          />
        </div>

        <div
          className={`
            scroll-mt-[181px] pb-10
            tablet:col-start-2 tablet:row-start-2 tablet:scroll-mt-[121px]
          `}
          id="list"
        >
          {list}
        </div>
        <div
          className={`
            fixed top-0 right-0 z-80 flex h-full max-w-[380px] flex-col
            items-start gap-y-5 bg-default text-left text-inverse duration-200
            ease-in-out
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
            tablet-landscape:bg-inherit tablet-landscape:py-24
            tablet-landscape:pb-12 tablet-landscape:drop-shadow-none
          `}
          id="filters"
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
                  mb-5 block w-full pt-4 pb-4 text-lg text-subtle shadow-bottom
                  tablet-landscape:mb-0 tablet-landscape:pt-10
                  tablet-landscape:pb-0 tablet-landscape:font-sans
                  tablet-landscape:text-xxs tablet-landscape:font-semibold
                  tablet-landscape:tracking-wide tablet-landscape:uppercase
                  tablet-landscape:shadow-none
                `}
              >
                Filter
              </legend>
              {filters}
            </fieldset>
            <div
              className={`
                sticky bottom-0 z-40 mt-auto w-full self-end border-t
                border-t-default bg-default px-8 py-4 drop-shadow-2xl
                tablet-landscape:hidden
              `}
            >
              <a
                className={`
                  flex cursor-pointer items-center justify-center gap-x-4
                  bg-footer px-4 py-3 font-sans text-xs text-nowrap text-inverse
                  uppercase
                  tablet-landscape:hidden
                `}
                href="#list"
                onClick={onCloseFiltersClick}
              >
                View {totalCount} Results
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ListHeader<T extends string>({
  listHeaderButtons,
  onFilterClick,
  sortProps,
  totalCount,
}: {
  listHeaderButtons?: ReactNode;
  onFilterClick: React.MouseEventHandler<HTMLAnchorElement>;
  sortProps: SortProps<T>;
  totalCount: number;
}): JSX.Element {
  const { currentSortValue, onSortChange, sortOptions } = sortProps;

  return (
    <div
      className={`
        grid grid-cols-[auto_auto_1fr_auto] items-baseline gap-y-7 px-container
        py-10 font-sans font-medium tracking-wide text-subtle uppercase
        tablet:grid-cols-[auto_auto_1fr_auto_auto] tablet:gap-x-4
        tablet-landscape:grid-cols-[auto_auto_1fr_minmax(302px,calc(33%_-_192px))_auto]
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
      <a
        className={`
          col-start-4 row-start-1 flex transform-gpu cursor-pointer items-center
          justify-center gap-x-4 bg-canvas px-4 py-2 text-nowrap text-muted
          uppercase shadow-all transition-transform
          hover:scale-110
          tablet:col-start-5 tablet:w-20
        `}
        href="#filters"
        onClick={onFilterClick}
      >
        Filter
      </a>
    </div>
  );
}
