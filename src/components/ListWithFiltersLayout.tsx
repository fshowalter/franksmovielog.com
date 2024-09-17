import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";

import { Avatar } from "./Avatar";
import { Backdrop, BackdropImageConfig } from "./Backdrop";
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
  breadcrumb,
  avatarImageProps,
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
  breadcrumb?: React.ReactNode;
  avatarImageProps?: AvatarImageProps;
}): JSX.Element {
  return (
    <Layout className="bg-subtle">
      {avatarImageProps ? (
        <AvatarBackdrop
          avatarImageProps={avatarImageProps}
          breadcrumb={breadcrumb}
          name={title}
          deck={deck}
        />
      ) : (
        <Backdrop
          imageProps={backdropImageProps}
          title={title}
          alt={alt}
          deck={deck}
          breadcrumb={breadcrumb}
        />
      )}
      <section className="mx-auto flex max-w-screen-max flex-col items-center pb-20">
        <div className="flex w-full flex-col items-stretch">
          <div className="flex grow flex-col">
            <div className="relative grid-cols-[1fr_48px_33%] tablet:px-12 showFilters:grid showFilters:grid-rows-[auto_1fr] showFilters:px-0">
              <div className="relative z-10 row-start-1 text-xs shadow-bottom tablet:shadow-none showFilters:ml-12 desktop:ml-20">
                <ListHeader
                  totalCount={totalCount}
                  onToggleFilters={onToggleFilters}
                  filtersVisible={filtersVisible}
                />
              </div>
              <div
                className="relative z-10 col-start-3 row-span-2 row-start-1 grid bg-subtle text-sm shadow-bottom transition-[grid-template-rows] duration-200 ease-in-out showFilters:mr-12 showFilters:block showFilters:py-24 showFilters:pb-12 showFilters:shadow-none desktop:mr-20"
                style={{
                  gridTemplateRows: filtersVisible ? "1fr" : "0fr",
                }}
              >
                <div className="w-full overflow-hidden bg-default px-container-base text-sm tablet:text-base showFilters:overflow-visible desktop:px-8">
                  <fieldset className="flex flex-col gap-10 py-10 tablet:gap-12 tablet:px-0">
                    <legend className="hidden w-full py-10 font-sans-bold text-xs uppercase tracking-[0.8px] text-subtle shadow-bottom min-[1024px]:block">
                      Filter & Sort
                    </legend>
                    {filters}
                  </fieldset>
                </div>
              </div>
              <div className="col-start-1 row-start-2 showFilters:pl-12 desktop:pl-20">
                {list}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function AvatarBackdrop({
  avatarImageProps,
  backdropImageProps,
  name,
  deck,
  breadcrumb,
}: {
  avatarImageProps: AvatarImageProps;
  name: string;
  deck: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <header className="relative flex min-h-[240px] flex-col content-start items-center justify-end gap-6 bg-[#2A2B2A] bg-cover pb-8 pt-40 text-inverse [background-position-x:center] tablet:pb-10 tablet:pt-40 desktop:min-h-[clamp(640px,50vh,1350px)] desktop:pb-16 desktop:pt-40">
      <div className="safari-border-radius-fix w-4/5 max-w-[250px] overflow-hidden rounded-[50%]">
        <Avatar
          imageProps={avatarImageProps}
          name={name}
          width={250}
          height={250}
          loading="lazy"
          decoding="async"
          data-pagefind-meta="image[src], image_alt[alt]"
        />
      </div>
      <div className="z-10 mx-auto w-full max-w-screen-max px-container text-center">
        {breadcrumb && (
          <p className="mb-2 font-sans-narrow text-sm uppercase tracking-[0.8px] underline decoration-subtle decoration-2 underline-offset-4">
            {breadcrumb}
          </p>
        )}
        <h1 className="font-sans-bold text-2xl uppercase desktop:text-7xl">
          {name}
        </h1>
        {deck && (
          <p className="mt-1 text-base desktop:my-4 desktop:text-lg">{deck}</p>
        )}
      </div>
    </header>
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
