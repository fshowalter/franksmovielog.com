import type { BackdropImageProps } from "src/api/backdrops";

import { Backdrop } from "./Backdrop";
import { Layout } from "./Layout";

export function ListWithFiltersLayout({
  title,
  deck,
  alt,
  totalCount,
  onToggleFilters,
  filtersVisible,
  backdropImageProps,
  filters,
  list,
}: {
  title: string;
  deck: string;
  alt: string;
  backdropImageProps: BackdropImageProps;
  filters: React.ReactNode;
  list: React.ReactNode;
  totalCount: number;
  onToggleFilters: () => void;
  filtersVisible: boolean;
}): JSX.Element {
  return (
    <Layout className="min-[1024px]:bg-[linear-gradient(90deg,var(--bg-default)_0%,var(--bg-default)_50%,var(--bg-subtle)_50%,var(--bg-subtle)_100%)]">
      <Backdrop
        imageProps={backdropImageProps}
        title={title}
        alt={alt}
        deck={deck}
      />
      <section className="mx-auto flex max-w-screen-max flex-col items-center">
        <div className="flex w-full flex-col items-stretch desktop:max-w-full desktop:flex-row">
          <div className="flex grow flex-col">
            <div className="relative grid-cols-[1fr_48px_33%] bg-default tablet:px-12 showFilters:grid showFilters:grid-rows-[auto_1fr] showFilters:px-0">
              <div className="relative z-10 row-start-1 bg-default text-xs shadow-bottom showFilters:ml-12 desktop:ml-20">
                <ListHeader
                  totalCount={totalCount}
                  onToggleFilters={onToggleFilters}
                  filtersVisible={filtersVisible}
                />
              </div>
              <div
                className="relative z-10 col-start-3 row-span-2 row-start-1 grid bg-subtle text-sm shadow-bottom transition-[grid-template-rows] duration-200 ease-in-out showFilters:block showFilters:pb-12 showFilters:shadow-none desktop:py-24"
                style={{
                  gridTemplateRows: filtersVisible ? "1fr" : "0fr",
                }}
              >
                <div className="w-full overflow-hidden bg-subtle px-container-base text-sm tablet:px-12 tablet:text-base showFilters:overflow-visible desktop:pr-20">
                  <fieldset className="flex flex-col gap-10 py-10 tablet:gap-12 tablet:px-0">
                    <legend className="hidden w-full py-10 font-sans-bold text-xs uppercase tracking-[0.8px] text-subtle shadow-bottom min-[1024px]:block">
                      Filter & Sort
                    </legend>
                    {filters}
                  </fieldset>
                </div>
              </div>
              <div className="col-start-1 row-start-2 bg-default showFilters:pl-12 desktop:pl-20">
                {list}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ListHeader({
  totalCount,
  onToggleFilters,
  filtersVisible,
}: {
  totalCount: number;
  onToggleFilters: () => void;
  filtersVisible: boolean;
}): JSX.Element {
  return (
    <div className="flex w-full items-center justify-between gap-12 px-container-base font-sans-bold uppercase tracking-[0.8px] text-subtle tablet:px-0">
      <span className="block py-10 tablet:w-full">
        <span className="font-sans-bold">{totalCount.toLocaleString()}</span>{" "}
        Results
      </span>
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-x-4 text-nowrap px-4 py-2 uppercase shadow-all min-[1024px]:hidden"
        style={{
          backgroundColor: filtersVisible
            ? "var(--bg-subtle)"
            : "var(--bg-default",
        }}
      >
        Filter & Sort
      </button>
    </div>
  );
}
