import type { ComponentProps } from "react";

import { GradeField } from "~/components/fields/GradeField";
import { YearField } from "~/components/fields/YearField";

import type { ReviewedTitleFiltersValues } from "./ReviewedTitleFilters.reducer";

import { TitleFilters } from "./TitleFilters";

type Props = ComponentProps<typeof TitleFilters> & {
  grade: {
    initialValue: ReviewedTitleFiltersValues["gradeValue"];
    onChange: (values: [number, number]) => void;
  };
  reviewYear: {
    initialValue: ReviewedTitleFiltersValues["reviewYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
};

export function ReviewedTitleFilters({
  genre,
  grade,
  releaseYear,
  reviewYear,
  title,
}: Props): React.JSX.Element {
  return (
    <>
      <TitleFilters genre={genre} releaseYear={releaseYear} title={title} />
      <GradeField
        initialValues={grade.initialValue}
        label="Grade"
        onGradeChange={grade.onChange}
      />
      <YearField
        initialValues={reviewYear.initialValue}
        label="Review Year"
        onYearChange={reviewYear.onChange}
        years={reviewYear.values}
      />
    </>
  );
}
