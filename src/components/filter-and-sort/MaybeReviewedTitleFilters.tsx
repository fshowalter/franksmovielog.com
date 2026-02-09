import type { ComponentProps } from "react";

import type { RadioListFieldOption } from "~/components/fields/RadioListField";

import { RadioListField } from "~/components/fields/RadioListField";

import { FilterSection } from "./FilterSection";
import { ReviewedTitleFilters } from "./ReviewedTitleFilters";

type Props = ComponentProps<typeof ReviewedTitleFilters> & {
  reviewedStatus: {
    counts?: Map<string, number>;
    defaultValue?: string;
    onChange: (value: string) => void;
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
  // Build options with counts for RadioListField
  const reviewedStatusOptions: RadioListFieldOption[] = [
    {
      count: reviewedStatus.counts?.get("All") ?? 0,
      label: "All",
      value: "All",
    },
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
      <FilterSection
        defaultOpen={
          !!reviewedStatus.defaultValue && reviewedStatus.defaultValue !== "All"
        }
        title="Reviewed Status"
      >
        <RadioListField
          defaultValue={reviewedStatus.defaultValue ?? "All"}
          label="Reviewed Status"
          onChange={reviewedStatus.onChange}
          onClear={
            reviewedStatus.onClear ??
            ((): void => reviewedStatus.onChange("All"))
          }
          options={reviewedStatusOptions}
        />
      </FilterSection>
    </>
  );
}
