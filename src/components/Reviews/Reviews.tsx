import { useReducer } from "react";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { Fieldset } from "../Fieldset";
import { Filters } from "./Filters";
import { Header } from "./Header";
import type { ListItemValue } from "./List";
import { List } from "./List";
import type { Sort } from "./Reviews.reducer";
import { initState, reducer } from "./Reviews.reducer";

export interface Props {
  values: ListItemValue[];
  initialSort: Sort;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
}

export function Reviews({
  values,
  initialSort,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values,
      initialSort,
    },
    initState,
  );

  return (
    <main className="min-[1024px]:bg-[linear-gradient(90deg,var(--bg-default)_0%,var(--bg-default)_50%,var(--bg-subtle)_50%,var(--bg-subtle)_100%)]">
      <header className="relative flex min-h-[240px] content-start items-end bg-cover pb-8 pt-40 text-[#fff] [background-position-x:center] tablet:min-h-[400px] tablet:pb-10 tablet:pt-40 desktop:min-h-[clamp(640px,50vh,1350px)] desktop:pb-16 desktop:pt-40">
        <img
          src="/reviews.jpg"
          className="absolute inset-0 size-full object-cover object-top"
          width="2400px"
          height="1350px"
        />
        <div className="z-10 mx-auto w-full max-w-screen-max px-[8%] tablet:px-12 desktop:px-20">
          <h1 className="font-sans-bold text-2xl uppercase desktop:text-7xl">
            Reviews
          </h1>
          <div className="spacer-y-1 desktop:spacer-y-4" />
          <p className="text-lg">"He chose... poorly."</p>
        </div>
      </header>
      <section className="mx-auto flex max-w-screen-max flex-col items-center">
        <div className="flex w-full flex-col items-stretch desktop:max-w-full desktop:flex-row">
          <div className="flex grow flex-col">
            <List
              dispatch={dispatch}
              groupedValues={state.groupedValues}
              visibleCount={state.showCount}
              totalCount={state.filteredValues.length}
              distinctGenres={distinctGenres}
              distinctReleaseYears={distinctReleaseYears}
              distinctReviewYears={distinctReviewYears}
              showFilters={state.showFilters}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
