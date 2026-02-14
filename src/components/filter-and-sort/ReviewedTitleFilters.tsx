import type { ComponentProps } from "react";

import { GradeField } from "~/components/fields/GradeField";
import { YearField } from "~/components/fields/YearField";

import { TitleFilters } from "./TitleFilters";

type Props = ComponentProps<typeof TitleFilters> & {
  grade: {
    defaultValues?: [number, number];
    onChange: (values: [number, number]) => void;
    onClear?: () => void;
  };
  reviewYear: {
    defaultValues?: [string, string];
    onChange: (values: [string, string]) => void;
    onClear?: () => void;
    values: readonly string[];
  };
};

/**
 * Filter controls for reviewed title lists.
 * @param props - Component props including title filters plus grade and review year
 * @returns Filter controls with grade and review year options
 */
export function ReviewedTitleFilters({
  genres,
  grade,
  releaseYear,
  reviewYear,
  title,
}: Props): React.JSX.Element {
  return (
    <>
      <TitleFilters genres={genres} releaseYear={releaseYear} title={title} />
      <GradeField
        defaultValues={grade.defaultValues}
        label="Grade"
        onClear={grade.onClear}
        onGradeChange={grade.onChange}
      />
      <YearField
        defaultValues={reviewYear.defaultValues}
        label="Review Year"
        onClear={reviewYear.onClear}
        onYearChange={reviewYear.onChange}
        years={reviewYear.values}
      />
    </>
  );
}
