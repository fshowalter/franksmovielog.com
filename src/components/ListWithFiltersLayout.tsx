import { type ReactNode, useState } from "react";

import { Layout } from "./Layout";

type Props = {
  backdrop: React.ReactNode;
  subNav?: React.ReactNode;
  filters: React.ReactNode;
  list: React.ReactNode;
  totalCount: number;
  listHeaderButtons?: React.ReactNode;
  mastGradient?: boolean;
};

export function ListWithFiltersLayout({
  totalCount,
  backdrop,
  filters,
  list,
  listHeaderButtons,
  subNav,
  mastGradient,
  ...rest
}: Props): JSX.Element {
  const [filtersVisible, toggleFilters] = useState(false);

  return (
    <Layout className="bg-subtle" {...rest} addGradient={mastGradient}>
      {backdrop}
      {subNav && subNav}
      <div className="mx-auto flex flex-col items-center bg-default">
        <div className="mx-auto flex w-full flex-col items-stretch">
          <div className="flex grow flex-col bg-subtle">
            <div className="relative tablet:px-12 tablet-landscape:px-0">
              <div className="relative z-10 row-start-1 bg-default text-xs tablet:-mx-12 tablet:px-0 tablet-landscape:col-span-3 tablet-landscape:mx-0 tablet-landscape:w-full">
                <ListHeader
                  totalCount={totalCount}
                  onToggleFilters={() => toggleFilters(!filtersVisible)}
                  filtersVisible={filtersVisible}
                  listHeaderButtons={listHeaderButtons}
                />
              </div>
              <div className="mx-auto max-w-screen-max grid-cols-[1fr_48px_minmax(398px,33%)] tablet-landscape:grid tablet-landscape:grid-rows-[auto_1fr]">
                <div
                  className="relative z-10 col-start-3 row-span-2 row-start-2 grid min-w-[350px] text-sm transition-[grid-template-rows] duration-200 ease-in-out tablet-landscape:mr-12 tablet-landscape:block tablet-landscape:py-24 tablet-landscape:pb-12 tablet-landscape:shadow-none desktop:mr-20"
                  style={{
                    gridTemplateRows: filtersVisible ? "1fr" : "0fr",
                  }}
                >
                  <div className="w-full overflow-hidden bg-subtle px-container text-sm tablet:text-base tablet-landscape:overflow-visible tablet-landscape:bg-default tablet-landscape:pt-0 desktop:px-8">
                    <fieldset className="mt-4 flex flex-col gap-10 bg-default px-container py-10 tablet:gap-12 tablet-landscape:mt-0 tablet-landscape:px-0">
                      <legend className="hidden w-full py-10 font-sans text-xs font-bold uppercase tracking-[0.8px] text-subtle tablet-landscape:shadow-bottom min-[1024px]:block">
                        Filter & Sort
                      </legend>
                      {filters}
                    </fieldset>
                  </div>
                </div>

                <div className="col-start-1 row-start-2 pb-10 tablet-landscape:pl-12 desktop:pl-20">
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

function ListHeader({
  totalCount,
  onToggleFilters,
  filtersVisible,
  listHeaderButtons,
}: {
  totalCount: number;
  onToggleFilters: () => void;
  filtersVisible: boolean;
  listHeaderButtons?: ReactNode;
}): JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-screen-max flex-wrap items-baseline justify-between gap-x-4 gap-y-5 px-container py-10 font-sans font-bold uppercase tracking-[1.2px] text-subtle">
      <span className="block pr-4">
        <span className="font-sans font-bold">
          {totalCount.toLocaleString()}
        </span>{" "}
        Results
      </span>
      {listHeaderButtons && (
        <div className="ml-auto flex w-1/2 flex-wrap justify-end gap-4">
          {listHeaderButtons}
        </div>
      )}
      <button
        onClick={onToggleFilters}
        className={`ml-auto flex justify-center gap-x-4 text-nowrap px-4 py-2 uppercase text-muted shadow-all tablet-landscape:hidden`}
        style={{
          backgroundColor: filtersVisible
            ? "var(--bg-subtle)"
            : "var(--bg-canvas)",
        }}
      >
        Filter & Sort
      </button>
    </div>
  );
}

export function ListHeaderButton({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-x-4 text-nowrap bg-default uppercase text-accent">
      <a
        className="block px-4 py-2 hover:bg-accent hover:text-inverse"
        href={href}
      >
        {text}
      </a>
    </div>
  );
}

type SubNavValue = {
  text: string;
  href: string;
  active?: boolean;
};

export function SubNav({ values }: { values: SubNavValue[] }) {
  return (
    <nav className="bg-footer">
      <ul className="mx-auto flex justify-center gap-x-6 text-nowrap px-container font-sans text-sm font-bold uppercase tracking-[1px] text-subtle">
        {values.map((value) => {
          return (
            <li
              key={value.href}
              className={`w-full max-w-32 text-center ${value.active ? "text-inverse" : "text-inverse-subtle"}`}
            >
              {value.active ? (
                <div className="px-4 py-8 desktop:py-12">{value.text}</div>
              ) : (
                <a
                  className="block px-4 py-8 hover:bg-default hover:text-default desktop:py-12"
                  href={value.href}
                >
                  {value.text}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
