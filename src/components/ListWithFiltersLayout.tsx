import { type JSX, type ReactNode, useRef } from "react";

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
          group/list-with-filters mx-auto flex flex-col items-center bg-default
        `}
      >
        <div className="mx-auto flex w-full flex-col items-stretch">
          <div className="flex grow flex-col bg-subtle">
            <div
              className={`
                relative
                tablet:px-12
                tablet-landscape:px-0
              `}
            >
              <div
                className={`
                  sticky top-0 z-10 row-start-1 border-b border-default
                  bg-default text-xs
                  tablet:-mx-12 tablet:px-0
                  tablet-landscape:static tablet-landscape:col-span-3
                  tablet-landscape:mx-0 tablet-landscape:w-full
                  tablet-landscape:border-none
                `}
              >
                <ListHeader
                  listHeaderButtons={listHeaderButtons}
                  sortProps={sortProps}
                  totalCount={totalCount}
                />
              </div>
              <div
                className={`
                  mx-auto max-w-(--breakpoint-desktop)
                  grid-cols-[1fr_48px_minmax(398px,33%)]
                  tablet-landscape:grid tablet-landscape:grid-rows-[auto_1fr]
                `}
              >
                <div
                  className={`
                    fixed top-0 right-0 col-start-3 row-span-2 row-start-2 flex
                    h-full w-0 max-w-[380px] transform-[translateX(100%)]
                    flex-col items-start gap-y-5 overflow-hidden bg-default
                    text-left text-inverse duration-200 ease-in-out
                    group-has-[#filters:checked]/list-with-filters:bottom-0
                    group-has-[#filters:checked]/list-with-filters:z-60
                    group-has-[#filters:checked]/list-with-filters:h-full
                    group-has-[#filters:checked]/list-with-filters:w-full
                    group-has-[#filters:checked]/list-with-filters:transform-[translateX(0)]
                    group-has-[#filters:checked]/list-with-filters:overflow-y-auto
                    group-has-[#filters:checked]/list-with-filters:drop-shadow-2xl
                    tablet:gap-y-10
                    tablet-landscape:relative tablet-landscape:mr-12
                    tablet-landscape:block tablet-landscape:w-auto
                    tablet-landscape:max-w-unset tablet-landscape:min-w-[320px]
                    tablet-landscape:transform-none tablet-landscape:bg-inherit
                    tablet-landscape:py-24 tablet-landscape:pb-12
                    tablet-landscape:drop-shadow-none
                    laptop:mr-20
                  `}
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
                          tablet-landscape:pb-0 tablet-landscape:font-sans
                          tablet-landscape:text-xs tablet-landscape:font-bold
                          tablet-landscape:tracking-wide
                          tablet-landscape:uppercase
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
                      <label
                        className={`
                          flex cursor-pointer items-center justify-center
                          gap-x-4 bg-footer px-4 py-3 font-sans text-xs
                          text-nowrap text-inverse uppercase
                          tablet-landscape:hidden
                        `}
                        htmlFor="filters"
                      >
                        View {totalCount} Results
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  className={`
                    col-start-1 row-start-2 pb-10
                    tablet-landscape:pl-12
                    laptop:pl-20
                  `}
                >
                  {list}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ListHeader<T extends string>({
  listHeaderButtons,
  sortProps,
  totalCount,
}: {
  listHeaderButtons?: ReactNode;
  sortProps: SortProps<T>;
  totalCount: number;
}): JSX.Element {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { currentSortValue, onSortChange, sortOptions } = sortProps;

  const executeScroll: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.currentTarget.checked) {
      headerRef?.current?.scrollIntoView();
    }
  };

  return (
    <div
      className={`
        mx-auto flex w-full max-w-(--breakpoint-desktop) flex-wrap
        items-baseline justify-end gap-x-2 gap-y-5 px-container py-10 font-sans
        font-medium tracking-wide text-subtle uppercase
        tablet-landscape:static
      `}
      ref={headerRef}
    >
      <span className="mr-auto block">
        <span className="font-semibold text-default">
          {totalCount.toLocaleString()}
        </span>
        <span className="text-xxs leading-none tracking-wide"> Results</span>
      </span>

      {listHeaderButtons && (
        <div className={`flex flex-wrap justify-end gap-4`}>
          {listHeaderButtons}
        </div>
      )}

      <input
        className="hidden"
        data-drawer
        id="filters"
        onChange={executeScroll}
        type="checkbox"
      />
      <label
        className={`
          relative z-40 flex transform-gpu cursor-pointer items-center
          justify-center gap-x-4 bg-canvas px-4 py-2 text-nowrap text-muted
          uppercase shadow-all transition-transform
          hover:scale-110
          tablet-landscape:hidden
        `}
        htmlFor="filters"
      >
        Filter
      </label>
      {sortOptions && (
        <div className={`ml-auto w-full`}>
          <label className="flex items-baseline gap-x-4 text-xxs tracking-wide">
            Sort{" "}
            <select
              className={`
                flex w-full appearance-none border-none bg-default py-2 pr-8
                pl-4 text-xs font-normal text-subtle shadow-all outline-accent
                tablet:max-w-1/3
                laptop:max-w-1/4
              `}
              onChange={onSortChange}
              value={currentSortValue}
            >
              {sortOptions}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
