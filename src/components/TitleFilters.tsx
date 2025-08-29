import { GradeInput } from "~/components/GradeInput";
import { MultiSelectField } from "~/components/MultiSelectField";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

type FilterValues = {
  genres?: string[];
  grade?: [number, number];
  releaseYear?: [string, string];
  reviewYear?: [string, string];
  title?: string;
};

export function TitleFilters({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  onGenreChange,
  onGradeChange,
  onReleaseYearChange,
  onReviewYearChange,
  onTitleChange,
}: {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: FilterValues;
  onGenreChange?: (values: string[]) => void;
  onGradeChange?: (values: [number, number]) => void;
  onReleaseYearChange?: (values: [string, string]) => void;
  onReviewYearChange?: (values: [string, string]) => void;
  onTitleChange?: (value: string) => void;
}) {
  return (
    <>
      {onTitleChange && (
        <TextFilter
          initialValue={filterValues.title || ""}
          label="Title"
          onInputChange={onTitleChange}
          placeholder="Enter all or part of a title"
        />
      )}
      {onReleaseYearChange && (
        <YearInput
          initialValues={filterValues.releaseYear || []}
          label="Release Year"
          onYearChange={onReleaseYearChange}
          years={distinctReleaseYears}
        />
      )}
      {onReviewYearChange && (
        <YearInput
          initialValues={filterValues.reviewYear || []}
          label="Review Year"
          onYearChange={onReviewYearChange}
          years={distinctReviewYears}
        />
      )}
      {onGradeChange && (
        <GradeInput
          initialValues={filterValues.grade || []}
          label="Grade"
          onGradeChange={onGradeChange}
        />
      )}
      {onGenreChange && (
        <MultiSelectField
          initialValues={filterValues.genres || []}
          label="Genres"
          onChange={onGenreChange}
          options={distinctGenres}
        />
      )}
    </>
  );
}
