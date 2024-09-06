import { PageTitle } from "../PageTitle";
import type { ListItemValue } from "./HomeListItem";
import { HomeListItem } from "./HomeListItem";
import { HomeSplash } from "./HomeSplash";

export interface Props {
  values: ListItemValue[];
}

export function Home({ values }: Props): JSX.Element {
  values = values.slice(1);
  return (
    <main>
      <div className="mx-auto px-pageMargin">
        <div className="spacer-y-6 desktop:spacer-y-8" />
        <HomeSplash value={values[0]} />
      </div>
      <div className="mx-auto bg-subtle px-pageMargin">
        <div className="spacer-y-6 desktop:spacer-y-16" />
        <ul className="mx-auto max-w-[calc(480px_*_3_+_2_*_var(--gutter-width))] tablet:grid tablet:w-auto tablet:grid-cols-[repeat(2,minmax(100px,312px))] tablet:gap-8 tablet:px-gutter desktop:grid-cols-[repeat(3,auto)] desktop:pt-2">
          {values.slice(1).map((value, index) => {
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
