import type { JSX } from "react";

import type { TitleFilterValues } from "~/components/ListWithFilters/titlesReducerUtils";

import { GradeField } from "~/components/GradeField";
import { MultiSelectField } from "~/components/MultiSelectField";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import { ReviewedStatusFilter } from "./ReviewedStatusFilter";

type TitleFiltersProps = {
  genre?: {
    initialValue: TitleFilterValues["genre"];
    onChange: (values: string[]) => void;
    values: readonly string[];
  };
  grade?: {
    initialValue: TitleFilterValues["grade"];
    onChange: (values: [number, number]) => void;
  };
  releaseYear?: {
    initialValue: TitleFilterValues["releaseYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  reviewedStatus?: {
    initialValue: TitleFilterValues["reviewedStatus"];
    onChange: (value: string) => void;
  };
  reviewYear?: {
    initialValue: TitleFilterValues["reviewYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  title?: {
    initialValue: TitleFilterValues["title"];
    onChange: (value: string) => void;
  };
};

export function TitleFilters({
  genre,
  grade,
  releaseYear,
  reviewedStatus,
  reviewYear,
  title,
}: TitleFiltersProps): JSX.Element {
  return (
    <>
      {title && (
        <TextFilter
          initialValue={title.initialValue}
          label="Title"
          onInputChange={title.onChange}
          placeholder="Enter all or part of a title"
        />
      )}
      {reviewedStatus && (
        <ReviewedStatusFilter
          initialValue={reviewedStatus.initialValue}
          onChange={reviewedStatus.onChange}
        />
      )}
      {releaseYear && (
        <YearInput
          initialValues={releaseYear.initialValue}
          label="Release Year"
          onYearChange={releaseYear.onChange}
          years={releaseYear.values}
        />
      )}
      {reviewYear && (
        <YearInput
          initialValues={reviewYear.initialValue}
          label="Review Year"
          onYearChange={reviewYear.onChange}
          years={reviewYear.values}
        />
      )}
      {grade && (
        <GradeField
          initialValues={grade.initialValue}
          label="Grade"
          onGradeChange={grade.onChange}
        />
      )}
      {genre && (
        <MultiSelectField
          initialValues={genre.initialValue}
          label="Genres"
          onChange={genre.onChange}
          options={genre.values}
        />
      )}
    </>
  );
}
