import {
  TitleFilters,
  type TitleFilterValues,
} from "~/components/TitleFilters";
import { TitleSortOptions } from "~/components/TitleSortOptions";

import type { ActionType } from "./reducer";

import { Actions } from "./reducer";

export function Filters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: TitleFilterValues;
}) {
  return (
    <TitleFilters
      distinctGenres={distinctGenres}
      distinctReleaseYears={distinctReleaseYears}
      distinctReviewYears={distinctReviewYears}
      filterValues={filterValues}
      onGenreChange={(values) =>
        dispatch({
          type: Actions.PENDING_FILTER_GENRES,
          values,
        })
      }
      onGradeChange={(values) =>
        dispatch({
          type: Actions.PENDING_FILTER_GRADE,
          values,
        })
      }
      onReleaseYearChange={(values) =>
        dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values })
      }
      onReviewYearChange={(values) =>
        dispatch({ type: Actions.PENDING_FILTER_REVIEW_YEAR, values })
      }
      onTitleChange={(value) =>
        dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
      }
      title={{
        initialValue={filterValues.title}
        onChange: (value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value }),
      }}
    />
  );
}

export function SortOptions() {
  return (
    <TitleSortOptions
      options={["title", "grade", "release-date", "review-date"]}
    />
  );
}
