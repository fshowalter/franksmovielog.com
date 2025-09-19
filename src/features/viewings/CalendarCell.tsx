import { ListItemTitle } from "~/components//list-item-title/ListItemTitle";
import { ListItemMediumAndVenue } from "~/components/list-item-medium-and-venue/ListItemMediumAndVenue";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

import type { CalendarCellData } from "./useCalendar";

/**
 * Renders a single cell in the viewings calendar grid.
 * @param props - Component props
 * @param props.value - Calendar cell data including date and viewings
 * @returns Table cell element with optional viewing list
 */
export function CalendarCell({
  value,
}: {
  value: CalendarCellData;
}): React.JSX.Element {
  if (!value.date) {
    return (
      <td
        className={`
          hidden min-h-[100px] border border-default bg-transparent p-2
          align-top
          tablet-landscape:table-cell
        `}
      />
    );
  }

  const dayOfWeek = value.dayOfWeek!; // Always defined for days with dates
  const hasViewings = Boolean(value.viewings && value.viewings.length > 0);

  return (
    <td
      className={`
        min-h-[100px] w-full border-default bg-calendar align-top
        tablet:border tablet:px-2
        tablet-landscape:mb-0 tablet-landscape:table-cell
        tablet-landscape:w-[14.28%] tablet-landscape:py-2
        ${hasViewings ? `block` : `hidden`}
      `}
      data-day-of-week={dayOfWeek}
    >
      <div
        className={`
          mb-1 px-container py-2 text-sm font-medium
          tablet:px-6 tablet:text-xl tablet:font-normal
          tablet-landscape:py-0
          ${hasViewings ? "text-default" : "text-muted"}
        `}
      >
        <span
          className={`
            mr-2 font-sans text-xs text-subtle uppercase
            tablet-landscape:hidden
          `}
        >
          {dayOfWeek}
        </span>
        {value.date}
      </div>
      {hasViewings && (
        <div className="@container/poster-list">
          <ol
            className={`
              flex flex-col
              [--poster-list-item-width:33.33%]
              tablet:flex-row tablet:flex-wrap
              tablet-landscape:flex-col
              tablet-landscape:[--poster-list-item-width:100%]
              @min-[calc((250px_*_3)_+_1px)]/poster-list:[--poster-list-item-width:25%]
            `}
          >
            {value.viewings!.map((viewing) => (
              <PosterListItem
                className="items-center"
                key={viewing.viewingSequence}
                posterImageProps={viewing.posterImageProps}
              >
                <div
                  className={`
                    flex grow flex-col items-start gap-y-1
                    tablet:mt-2 tablet:w-full tablet:px-1
                  `}
                >
                  <ListItemTitle
                    slug={viewing.slug}
                    title={viewing.title}
                    year={viewing.releaseYear}
                  />
                  <ListItemMediumAndVenue
                    medium={viewing.medium}
                    venue={viewing.venue}
                  />
                </div>
              </PosterListItem>
            ))}
          </ol>
        </div>
      )}
    </td>
  );
}
