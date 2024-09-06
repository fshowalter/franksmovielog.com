import { PageTitle } from "../PageTitle";
import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";
import { HomeSplash } from "./HomeSplash";

export interface Props {
  values: ListItemValue[];
}

export function Home({ values }: Props): JSX.Element {
  return (
    <main className="bg-subtle">
      <div className="mx-auto max-w-canvas">
        <div className="spacer-y-6 desktop:spacer-y-8" />
        <PageTitle className="text-center">Latest Updates</PageTitle>
        <div className="spacer-y-6 desktop:spacer-y-8" />
        <ul className="w-full tablet:grid tablet:w-auto tablet:grid-cols-[repeat(2,minmax(100px,312px))] tablet:gap-8 tablet:px-gutter desktop:max-w-unset desktop:grid-cols-[repeat(3,1fr)] desktop:px-pageMargin desktop:pt-2">
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
            className="mx-auto bg-default px-pageMargin py-2 tracking-wide text-accent shadow-all hover:shadow-border-accent"
          >
            All Reviews
          </a>
        </div>
      </div>
    </main>
  );
}
