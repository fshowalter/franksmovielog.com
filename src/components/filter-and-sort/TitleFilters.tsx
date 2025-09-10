import { MultiSelectField } from "~/components/fields/MultiSelectField";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";

import type { TitleFilterValues } from "./titlesReducerUtils";

type TitleFiltersProps = {
  genre: {
    initialValue: TitleFilterValues["genre"];
    onChange: (values: string[]) => void;
    values: readonly string[];
  };
  releaseYear: {
    initialValue: TitleFilterValues["releaseYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  title: {
    initialValue: TitleFilterValues["title"];
    onChange: (value: string) => void;
  };
};

export function TitleFilters({
  genre,
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
      <MultiSelectField
        initialValues={genre.initialValue}
        label="Genres"
        onChange={genre.onChange}
        options={genre.values}
      />
    </>
  );
}
