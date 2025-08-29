import type { JSX } from "react";

import { CreditedAsFilter } from "~/components/CreditedAsFilter";
import { GradeInput } from "~/components/GradeInput";
import { MultiSelectField } from "~/components/MultiSelectField";
import { ReviewedStatusFilter } from "~/components/ReviewedStatusFilter";
import { SelectField } from "~/components/SelectField";
import { TextFilter } from "~/components/TextFilter";
import {
  TitleFilters,
  type TitleFilterValues,
} from "~/components/TitleFilters";
import { YearInput } from "~/components/YearInput";
import { capitalize } from "~/utils/capitalize";

import type { ActionType } from "./CastAndCrewMember.reducer";

import { Actions } from "./CastAndCrewMember.reducer";

type FilterValues = TitleFilterValues & {
  creditedAs?: string;
  reviewedStatus?: string;
};

export function Filters({
  creditedAs,
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  creditedAs: readonly string[];
  dispatch: React.Dispatch<ActionType>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      {creditedAs.length > 1 && (
        <CreditedAsFilter
          initialValue={filterValues.creditedAs}
          onChange={(value) =>
            dispatch({
              type: Actions.PENDING_FILTER_CREDIT_KIND,
              value,
            })
          }
          values={creditedAs}
        />
      )}
      <ReviewedStatusFilter
        initialValue={filterValues.reviewedStatus}
        onChange={(value) =>
          dispatch({
            type: Actions.PENDING_FILTER_REVIEW_STATUS,
            value,
          })
        }
      />
      <TitleFilters
        distinctReleaseYears={distinctReleaseYears}
        filterValues={filterValues}
        onReleaseYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values })
        }
        onTitleChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
      />
      <YearInput
        initialValues={filterValues.reviewYear || []}
        label="Review Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_REVIEW_YEAR, values })
        }
        years={distinctReviewYears}
      />
      <GradeInput
        label="Grade"
        onGradeChange={(values) =>
          dispatch({
            type: Actions.PENDING_FILTER_GRADE,
            values,
          })
        }
      />
      <MultiSelectField
        label="Genres"
        onChange={(values) =>
          dispatch({
            type: Actions.PENDING_FILTER_GENRES,
            values,
          })
        }
        options={distinctGenres}
      />
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </>
  );
}
