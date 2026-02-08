import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";
import { FilterSection } from "~/components/filter-and-sort/FilterSection";

type TitleFiltersProps = {
  genres?: {
    counts?: Map<string, number>;
    defaultValues?: readonly string[];
    onChange: (values: string[]) => void;
    onClear?: () => void;
    values: readonly string[];
  };
  releaseYear: {
    defaultValues?: [string, string];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  title: {
    defaultValue?: string;
    onChange: (value: string) => void;
  };
};

/**
 * Filter controls for title-based lists.
 * @param props - Component props
 * @param props.genres - Genre filter configuration
 * @param props.releaseYear - Release year filter configuration
 * @param props.title - Title search filter configuration
 * @returns Title filter controls
 */
export function TitleFilters({
  genres,
  releaseYear,
  title,
}: TitleFiltersProps): React.JSX.Element {
  return (
    <>
      <TextField
        defaultValue={title.defaultValue}
        label="Title"
        onInputChange={title.onChange}
        placeholder="Enter all or part of a title"
      />
      <YearField
        defaultValues={releaseYear.defaultValues}
        label="Release Year"
        onYearChange={releaseYear.onChange}
        years={releaseYear.values}
      />
      {genres && (
        <FilterSection
          defaultOpen={
            genres.defaultValues !== undefined &&
            genres.defaultValues.length > 0
          }
          title="Genres"
        >
          <CheckboxListField
            defaultValues={genres.defaultValues}
            label="Genres"
            onChange={genres.onChange}
            onClear={genres.onClear}
            options={genres.values.map((value) => ({
              count: genres.counts?.get(value) ?? 0,
              label: value,
              value,
            }))}
          />
        </FilterSection>
      )}
    </>
  );
}
