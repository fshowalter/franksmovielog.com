import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";
import { HomeSplash } from "./HomeSplash";

export interface Props {
  values: ListItemValue[];
}

export function Home({ values }: Props): JSX.Element {
  return (
    <main>
      <header className="relative flex min-h-[240px] content-start items-end bg-cover pb-8 pt-40 text-[#fff] [background-position-x:center] tablet:min-h-[400px] tablet:pb-10 tablet:pt-40 desktop:min-h-[clamp(640px,50vh,1350px)] desktop:pb-16 desktop:pt-40">
        <img
          src="/casablanca.jpg"
          className="absolute inset-0 size-full object-cover object-top"
          width="2400px"
          height="1350px"
        />
        <div className="z-10 mx-auto w-full max-w-screen-max px-[8%] tablet:px-12 desktop:px-20">
          <h1 className="text-4xl desktop:text-7xl">Frank&apos;s Movie Log</h1>
          <div className="spacer-y-1 desktop:spacer-y-4" />
          <p className="text-base desktop:text-lg">
            Quality reviews of films of questionable quality.
          </p>
        </div>
      </header>
      <section className="bg-subtle">
        <div className="mx-auto max-w-screen-max px-[8%] tablet:px-[calc(48px_-_1.5%)] desktop:px-20">
          <div className="pb-8 desktop:pb-32">
            <h2 className="py-10 font-sans-bold text-xs font-bold uppercase tracking-[0.8px] text-subtle tablet:px-[1.5%] desktop:px-0">
              Latest Reviews
            </h2>
            <ul className="flex w-full flex-col flex-wrap justify-center gap-x-[3%] gap-y-8 tablet:flex-row tablet:justify-between tablet:gap-y-8 desktop:gap-y-20">
              {values.map((value, index) => {
                return (
                  <HomeListItem
                    key={value.sequence}
                    value={value}
                    eagerLoadImage={index === 0}
                  />
                );
              })}
            </ul>
            <div className="flex py-10">
              <a
                href="/reviews/"
                className="mx-auto w-full max-w-[430px] bg-default px-pageMargin py-5 text-center font-sans-caps text-sm uppercase tracking-[.6px] text-accent"
              >
                All Reviews
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
