import type { ComponentProps } from "react";

import { ReviewedStatusFilter } from "./ReviewedStatusFilter";
import { ReviewedTitleFilters } from "./ReviewedTitleFilters";

type Props = ComponentProps<typeof ReviewedTitleFilters> & {
  reviewedStatus: {
    initialValue?: string;
    onChange: (value: string) => void;
  };
};

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
