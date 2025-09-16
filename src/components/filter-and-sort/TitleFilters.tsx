import { MultiSelectField } from "~/components/fields/MultiSelectField";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";

type TitleFiltersProps = {
  genres?: {
    initialValue?: readonly string[];
    onChange: (values: string[]) => void;
    values: readonly string[];
  };
  releaseYear: {
    initialValue?: [string, string];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  title: {
    initialValue?: string;
    onChange: (value: string) => void;
  };
};

export function TitleFilters({
  genres,
  releaseYear,
  title,
}: TitleFiltersProps): React.JSX.Element {
  return (
    <>
      <TextField
        initialValue={title.initialValue}
        label="Title"
        onInputChange={title.onChange}
        placeholder="Enter all or part of a title"
      />
      <YearField
        initialValues={releaseYear.initialValue}
        label="Release Year"
        onYearChange={releaseYear.onChange}
        years={releaseYear.values}
      />
      {genres && (
        <MultiSelectField
          initialValues={genres.initialValue}
          label="Genres"
          onChange={genres.onChange}
          options={genres.values}
        />
      )}
    </>
  );
}
