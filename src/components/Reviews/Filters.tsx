import { DebouncedInput } from "src/components/DebouncedInput";
import { GradeInput } from "src/components/GradeInput";
import { MultiSelectField } from "src/components/MultiSelectField";
import { SelectField } from "src/components/SelectField";
import { YearInput } from "src/components/YearInput";

import type { ActionType, Sort } from "./Reviews.reducer";
import { Actions } from "./Reviews.reducer";

export function Filters({
  dispatch,
  sortValue,
  distinctReleaseYears,
  distinctReviewYears,
  distinctGenres,
  showFilters,
  onToggleFilters,
}: {
  dispatch: React.Dispatch<ActionType>;
  sortValue: string;
  distinctReviewYears: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctGenres: readonly string[];
}) {
  return (
    <>
      <div
        className="min-[1024px]:!block"
        style={{ display: showFilters ? "block" : "none" }}
      >
        <fieldset className="relative z-10 flex grid-cols-2 flex-col gap-6 px-[8%] py-10 shadow-bottom tablet:grid tablet:gap-12 tablet:px-0 min-[1024px]:-mt-[96px] min-[1024px]:flex min-[1024px]:gap-10 min-[1024px]:shadow-none">
          <legend className="hidden pt-10 font-sans-bold text-xs uppercase leading-[34px] tracking-[0.8px] text-subtle tablet:grid-cols-2 min-[1024px]:block">
            Filter & Sort
          </legend>
          <DebouncedInput
            label="Title"
            placeholder="Enter all or part of a title"
            onInputChange={(value) =>
              dispatch({ type: Actions.FILTER_TITLE, value })
            }
          />
          <YearInput
            label="Release Year"
            years={distinctReleaseYears}
            onYearChange={(values) =>
              dispatch({ type: Actions.FILTER_RELEASE_YEAR, values })
            }
          />
          <YearInput
            label="Review Year"
            years={distinctReviewYears}
            onYearChange={(values) =>
              dispatch({ type: Actions.FILTER_REVIEW_YEAR, values })
            }
          />
          <GradeInput
            label="Grade"
            onGradeChange={(values) =>
              dispatch({
                type: Actions.FILTER_GRADE,
                values,
              })
            }
          />
          <MultiSelectField
            label="Genres"
            options={distinctGenres}
            onChange={(e) =>
              dispatch({
                type: Actions.FILTER_GENRES,
                values: e.map((selection) => selection.value),
              })
            }
          />
          <SelectField
            value={sortValue}
            label="Sort"
            onChange={(e) =>
              dispatch({
                type: Actions.SORT,
                value: e.target.value as Sort,
              })
            }
          >
            <option value="title-asc">Title (A &rarr; Z)</option>
            <option value="title-desc">Title (Z &rarr; A)</option>
            <option value="grade-desc">Grade (Best First)</option>
            <option value="grade-asc">Grade (Worst First)</option>
            <option value="release-date-desc">
              Release Date (Newest First)
            </option>
            <option value="release-date-asc">
              Release Date (Oldest First)
            </option>
            <option value="review-date-desc">Review Date (Newest First)</option>
            <option value="review-date-asc">Review Date (Oldest First)</option>
          </SelectField>
        </fieldset>
      </div>
    </>
  );
}
