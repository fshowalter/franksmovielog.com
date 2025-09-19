import type { PosterImageProps } from "~/api/posters";

import { ListItemMediumAndVenue } from "~/components/list-item-medium-and-venue/ListItemMediumAndVenue";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { PosterList } from "~/components/poster-list/PosterList";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

/**
 * Value object for a most watched person item.
 */
export type MostWatchedPeopleListItemValue = {
  count: number;
  name: string;
  slug: string | undefined;
  viewings: ViewingSubListItemValue[];
};

type ViewingSubListItemValue = {
  displayDate: string;
  medium: string | undefined;
  posterImageProps: PosterImageProps;
  releaseYear: string;
  slug: string | undefined;
  title: string;
  venue: string | undefined;
  viewingSequence: number;
};

/**
 * Component for displaying most watched people.
 * @param props - Component props
 * @param props.header - Section header text
 * @param props.values - Array of most watched people
 * @returns Most watched people list or false if no values
 */
export function MostWatchedPeople({
  header,
  values,
}: {
  header: string;
  values: readonly MostWatchedPeopleListItemValue[];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <section
      className={`
        w-full bg-default pb-8
        tablet:px-container
        laptop:px-12
      `}
    >
      <h2
        className={`
          px-container py-4 text-xl font-medium
          tablet:px-0
        `}
      >
        {header}
      </h2>
      <div className={`w-full`}>
        {values.map((value) => {
          return (
            <div className="py-3" key={value.name}>
              <div
                className={`
                  flex justify-between px-container
                  tablet:px-0
                `}
              >
                <div
                  className={`
                    transform-gpu font-sans text-xs text-muted
                    transition-transform
                    tablet:text-sm
                  `}
                >
                  <Name value={value} />
                </div>
                <div
                  className={`
                    col-start-2 self-center pr-1 pb-1 text-right font-sans
                    text-sm text-nowrap text-subtle
                  `}
                >
                  {value.count}
                </div>
              </div>
              <div
                className={`
                  col-span-2 row-start-2 px-container
                  tablet:px-0
                `}
              >
                <details
                  className={`
                    rounded-md bg-canvas px-2
                    open:pb-2
                  `}
                >
                  <summary
                    className={`
                      cursor-pointer rounded-sm py-1 font-sans text-sm
                      font-normal tracking-prose text-subtle
                    `}
                  >
                    Details
                  </summary>
                  <PosterList className="bg-subtle">
                    {value.viewings.map((viewing) => {
                      return (
                        <MostWatchedPersonViewingListItem
                          key={viewing.viewingSequence}
                          value={viewing}
                        />
                      );
                    })}
                  </PosterList>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MostWatchedPersonViewingListItem({
  value,
}: {
  value: ViewingSubListItemValue;
}): React.JSX.Element {
  return (
    <PosterListItem
      bgClasses={`
        ${value.slug ? "bg-default" : "bg-unreviewed"}
      `}
      posterImageProps={value.posterImageProps}
    >
      <div
        className={`
          flex grow flex-col items-start gap-y-1
          tablet:mt-2 tablet:w-full tablet:px-1
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        <ListItemReviewDate displayDate={value.displayDate} />
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </PosterListItem>
  );
}

function Name({
  value,
}: {
  value: MostWatchedPeopleListItemValue;
}): React.JSX.Element {
  if (value.slug) {
    return (
      <a
        className={`
          relative inline-block font-serif text-base leading-6 font-medium
          text-accent
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-bottom-left after:scale-x-0 after:bg-(--fg-accent)
          after:transition-all after:duration-500
          hover:after:scale-x-100
        `}
        href={`/cast-and-crew/${value.slug}/`}
      >
        {value.name}
      </a>
    );
  }

  return (
    <span
      className={`
        inline-block font-serif text-base leading-6 font-normal text-muted
      `}
    >
      {value.name}
    </span>
  );
}
