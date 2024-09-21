import { type ReactNode, useState } from "react";
import type { AvatarImageProps } from "src/api/avatars";

import { Avatar } from "./Avatar";
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
}: Props): JSX.Element {
  const [filtersVisible, toggleFilters] = useState(false);

  return (
    <Layout className="bg-subtle" addGradient={mastGradient}>
      {backdrop}
      {subNav && subNav}
      <section className="mx-auto flex flex-col items-center bg-default">
        <div className="mx-auto flex w-full flex-col items-stretch">
          <div className="flex grow flex-col bg-subtle">
            <div className="relative tablet:px-12 showFilters:px-0">
              <div className="relative z-10 row-start-1 bg-default text-xs tablet:-mx-12 tablet:px-0 showFilters:col-span-3 showFilters:mx-0 showFilters:w-full">
                <ListHeader
                  totalCount={totalCount}
                  onToggleFilters={() => toggleFilters(!filtersVisible)}
                  filtersVisible={filtersVisible}
                  listHeaderButtons={listHeaderButtons}
                />
              </div>
              <div className="mx-auto max-w-screen-max grid-cols-[1fr_48px_33%] showFilters:grid showFilters:grid-rows-[auto_1fr]">
                <div
                  className="relative z-10 col-start-3 row-span-2 row-start-2 grid text-sm transition-[grid-template-rows] duration-200 ease-in-out showFilters:mr-12 showFilters:block showFilters:py-24 showFilters:pb-12 showFilters:shadow-none desktop:mr-20"
                  style={{
                    gridTemplateRows: filtersVisible ? "1fr" : "0fr",
                    marginTop: filtersVisible ? "24px" : 0,
                  }}
                >
                  <div className="w-full overflow-hidden bg-default px-container-base text-sm tablet:text-base showFilters:overflow-visible desktop:px-8">
                    <fieldset className="flex flex-col gap-10 py-10 tablet:gap-12 tablet:px-0">
                      <legend className="hidden w-full py-10 font-sans-bold text-xs uppercase tracking-[0.8px] text-subtle showFilters:shadow-bottom min-[1024px]:block">
                        Filter & Sort
                      </legend>
                      {filters}
                    </fieldset>
                  </div>
                </div>

                <div className="col-start-1 row-start-2 pb-10 showFilters:pl-12 desktop:pl-20">
                  {list}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function AvatarBackdrop({
  avatarImageProps,
  name,
  deck,
  breadcrumb,
}: {
  avatarImageProps: AvatarImageProps | null;
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

export function SolidBackdrop({
  title,
  deck,
  breadcrumb,
}: {
  title: string;
  deck: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <header className="relative flex min-h-[240px] flex-col content-start items-center justify-end gap-6 bg-[#2A2B2A] bg-cover pb-8 pt-40 text-inverse [background-position-x:center] tablet:pb-10 tablet:pt-40 desktop:min-h-[clamp(640px,50vh,1350px)] desktop:pb-16 desktop:pt-40">
      <div className="z-10 mx-auto w-full max-w-screen-max px-container">
        {breadcrumb && (
          <p className="mb-2 font-sans-narrow text-sm uppercase tracking-[0.8px] underline decoration-subtle decoration-2 underline-offset-4">
            {breadcrumb}
          </p>
        )}
        <h1 className="font-sans-bold text-2xl uppercase desktop:text-7xl">
          {title}
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
  listHeaderButtons,
}: {
  totalCount: number;
  onToggleFilters: () => void;
  filtersVisible: boolean;
  listHeaderButtons?: ReactNode;
}): JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-screen-max flex-wrap items-baseline justify-between gap-x-4 gap-y-5 px-container py-10 font-sans-bold uppercase tracking-[0.5px] text-subtle">
      <span className="block pr-4">
        <span className="font-sans-bold">{totalCount.toLocaleString()}</span>{" "}
        Results
      </span>
      {listHeaderButtons && (
        <div className="ml-auto flex w-1/2 flex-wrap justify-end gap-4">
          {listHeaderButtons}
        </div>
      )}
      <button
        onClick={onToggleFilters}
        className={`ml-auto flex justify-center gap-x-4 text-nowrap px-4 py-2 uppercase text-muted shadow-all min-[1024px]:hidden`}
        style={{
          backgroundColor: filtersVisible
            ? "var(--bg-subtle)"
            : "var(--bg-default)",
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
    <div className="flex items-start gap-x-4 text-nowrap bg-default px-4 py-2 uppercase text-accent hover:bg-accent hover:text-inverse">
      <a href={href}>{text}</a>
    </div>
  );
}

type SubNavValue = {
  text: string;
  href: string;
  active?: boolean;
};

export function SubNav({
  values,
  className = "bg-[#252525]",
}: {
  values: SubNavValue[];
  className?: string;
}) {
  return (
    <nav className={className}>
      <ul className="mx-auto flex justify-center gap-x-6 text-nowrap px-container font-sans-narrow-bold text-sm uppercase tracking-[1px] text-subtle">
        {values.map((value) => {
          return (
            <li
              key={value.href}
              className={`w-full max-w-32 text-center opacity-75 ${value.active ? "text-inverse opacity-75" : ""}`}
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
