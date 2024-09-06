import { PageTitle } from "../PageTitle";
import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";
import { HomeSplash } from "./HomeSplash";

export interface Props {
  values: ListItemValue[];
}

export function Home({ values }: Props): JSX.Element {
  return (
    <main className="mx-auto max-w-canvas">
      <div className="spacer-y-6 desktop:spacer-y-8" />
      <PageTitle className="text-center">Latest Updates</PageTitle>
      <div className="spacer-y-6 desktop:spacer-y-8" />
      <HomeSplash value={values[0]} />
      <ol className="flex flex-col">
        {values.slice(1).map((value, index) => {
          return (
            <HomeListItem
              key={value.sequence}
              value={value}
              eagerLoadImage={index === 0}
            />
          );
        })}
      </ol>
      <div className="flex py-10">
        <a
          href="/reviews/"
          className="mx-auto px-pageMargin py-2 tracking-wide text-accent shadow-all hover:shadow-border-accent"
        >
          All Reviews
        </a>
      </div>
    </main>
  );
}
