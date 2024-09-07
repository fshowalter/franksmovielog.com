import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";
import { HomeSplash } from "./HomeSplash";

export interface Props {
  values: ListItemValue[];
}

export function Home({ values }: Props): JSX.Element {
  return (
    <main>
      <header className="flex min-h-[520px] content-start items-end bg-[url(/casablanca.jpg)] bg-cover px-20 pb-16 pt-40 text-[#fff] [background-position-x:center]">
        <div className="mx-auto w-full max-w-[1696px] px-20">
          <h1 className="text-7xl">Frank&apos;s Movie Log</h1>
          <div className="spacer-y-4" />
          <p className="text-lg">
            Quality reviews of films of questionable quality.
          </p>
        </div>
      </header>
      <section className="bg-subtle px-pageMargin">
        {/* <div className="mx-auto max-w-[1696px]">
          <div className="spacer-y-6 desktop:spacer-y-20" />
          <HomeSplash value={values[0]} />
        </div> */}
        <div className="mx-auto max-w-[1696px] px-10 pb-32">
          <div className="spacer-y-6 desktop:spacer-y-16" />
          <ul className="flex w-full flex-wrap justify-center gap-x-[3%] gap-y-20">
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
              className="font-sans-caps mx-auto w-full max-w-[430px] bg-default px-pageMargin py-5 text-center text-sm uppercase tracking-[.6px] text-accent"
            >
              All Reviews
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
