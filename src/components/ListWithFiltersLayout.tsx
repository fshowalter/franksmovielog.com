import { Fieldset } from "./Fieldset";

export function ListWithFiltersLayout({
  title,
  slug,
  heroSrc,
  filters,
  list,
}: {
  title: string;
  slug: string;
  heroSrc: string;
  filters: React.ReactNode;
  list: React.ReactNode;
}): JSX.Element {
  return (
    <main className="bg-[linear-gradient(90deg,var(--bg-default)_0%,var(--bg-default)_50%,var(--bg-subtle)_50%,var(--bg-subtle)_100%)]">
      <header className="relative flex min-h-[240px] content-start items-end bg-cover pb-8 pt-40 text-[#fff] [background-position-x:center] tablet:min-h-[400px] tablet:pb-10 tablet:pt-40 desktop:min-h-[clamp(640px,50vh,1350px)] desktop:pb-16 desktop:pt-40">
        <img
          src={heroSrc}
          className="absolute inset-0 size-full object-cover object-top"
          width="2400px"
          height="1350px"
        />
        <div className="z-10 mx-auto w-full max-w-screen-max px-[8%] tablet:px-12 desktop:px-20">
          <h1 className="font-sans-bold text-7xl uppercase">{title}</h1>
          <div className="spacer-y-4" />
          <p className="text-lg">{slug}</p>
        </div>
      </header>
      <section className="mx-auto flex max-w-canvas flex-col items-center">
        <div className="flex w-full flex-col items-stretch desktop:max-w-full desktop:flex-row">
          <div className="flex basis-96 flex-col items-center bg-subtle px-gutter pt-8 desktop:order-2 desktop:px-pageMargin">
            {/* <div className="flex flex-col items-center">{header}</div> */}
            <div className="desktop:sticky desktop:top-[var(--header-offset)]">
              <div className="spacer-y-8" />
              <Fieldset legend="Filter & Sort" className="desktop:self-start">
                {filters}
              </Fieldset>
              <div className="spacer-y-8" />
            </div>
          </div>
          <div className="flex grow flex-col bg-default px-pageMargin">
            <div className="h-0 min-h-0 desktop:h-8 desktop:min-h-8" />
            {list}
            <div className="spacer-y-6" />
          </div>
        </div>
      </section>
    </main>
  );
}
