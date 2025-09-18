import type { ComponentProps } from "react";

import { ReviewedStatusFilter } from "./ReviewedStatusFilter";
import { ReviewedTitleFilters } from "./ReviewedTitleFilters";

type Props = ComponentProps<typeof ReviewedTitleFilters> & {
  reviewedStatus: {
    initialValue?: string;
    onChange: (value: string) => void;
  };
};

/**
 * Filter controls for title lists that may include unreviewed titles.
 * @param props - Component props including all reviewed title filters plus reviewed status
 * @returns Filter controls with reviewed status option
 */
export function MaybeReviewedTitleFilters({
  genres,
  grade,
  releaseYear,
  reviewedStatus,
  reviewYear,
  title,
}: Props): React.JSX.Element {
  return (
    <>
      <ReviewedTitleFilters
        genres={genres}
        grade={grade}
        releaseYear={releaseYear}
        reviewYear={reviewYear}
        title={title}
      />
      <ReviewedStatusFilter
        defaultValue={reviewedStatus.initialValue}
        onChange={reviewedStatus.onChange}
      />
    </>
  );
}
