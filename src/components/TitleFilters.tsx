import { GradeInput } from "~/components/GradeInput";
import { MultiSelectField } from "~/components/MultiSelectField";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

type TitleFiltersProps = {
  genre?: {
    initialValue: readonly string[] | undefined;
    onChange: (values: string[]) => void;
    values: readonly string[];
  };
  grade?: {
    initialValue: [number, number] | undefined;
    onChange: (values: [number, number]) => void;
  };
  releaseYear?: {
    initialValue: [string, string];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  reviewYear?: {
    initialValue: [string, string];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  title?: {
    initialValue: string | undefined;
    onChange: (value: string) => void;
  };
};

export function TitleFilters({
  genre,
  grade,
  releaseYear,
  reviewYear,
  title,
}: TitleFiltersProps) {
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
        <GradeInput
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
