import type { ComponentProps } from "react";

import type { CheckboxListFieldOption } from "~/components/fields/CheckboxListField";

import { CheckboxListField } from "~/components/fields/CheckboxListField";

import { FilterSection } from "./FilterSection";
import { ReviewedTitleFilters } from "./ReviewedTitleFilters";

type Props = ComponentProps<typeof ReviewedTitleFilters> & {
  reviewedStatus: {
    counts?: Map<string, number>;
    defaultValues?: readonly string[];
    onChange: (values: string[]) => void;
    onClear?: () => void;
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
  // Build options with counts for CheckboxListField
  const reviewedStatusOptions: CheckboxListFieldOption[] = [
    {
      count: reviewedStatus.counts?.get("Reviewed") ?? 0,
      label: "Reviewed",
      value: "Reviewed",
    },
    {
      count: reviewedStatus.counts?.get("Not Reviewed") ?? 0,
      label: "Not Reviewed",
      value: "Not Reviewed",
    },
  ];

  return (
    <>
      <ReviewedTitleFilters
        genres={genres}
        grade={grade}
        releaseYear={releaseYear}
        reviewYear={reviewYear}
        title={title}
      />
      <FilterSection title="Reviewed Status">
        <CheckboxListField
          defaultValues={reviewedStatus.defaultValues ?? []}
          label="Reviewed Status"
          onChange={reviewedStatus.onChange}
          onClear={
            reviewedStatus.onClear ?? ((): void => reviewedStatus.onChange([]))
          }
          options={reviewedStatusOptions}
        />
      </FilterSection>
    </>
  );
}
