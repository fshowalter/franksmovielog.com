import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickCreditedAsFilterOption,
  getCreditedAsFilter,
} from "~/components/filter-and-sort/CreditedAsFilter.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { clickReviewedStatusFilterOption } from "~/components/filter-and-sort/ReviewedStatusFilter.testHelper";
import {
  clickGenresFilterOption,
  fillGradeFilter,
  fillReleaseYearFilter,
  fillReviewYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import { getReviewCardList } from "~/components/review-card-list/ReviewCardList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type {
  CastAndCrewMemberTitlesProps,
  CastAndCrewMemberTitlesValue,
} from "./CastAndCrewMemberTitles";

import { CastAndCrewMemberTitles } from "./CastAndCrewMemberTitles";

// Inline minimal fixture data for testing
let testIdCounter = 0;
const createTitle = (
  overrides: Partial<CastAndCrewMemberTitlesValue> = {},
): CastAndCrewMemberTitlesValue => {
  testIdCounter += 1;
  return {
    creditedAs: ["Director"],
    excerpt: "test excerpt",
    genres: ["Drama"],
    grade: "B+",
    gradeValue: 8,
    imdbId: `tt${String(testIdCounter).padStart(7, "0")}`,
    releaseSequence: testIdCounter,
    releaseYear: "1960",
    reviewDisplayDate: "Jan 1, 2020",
    reviewSequence: testIdCounter,
    reviewYear: "2020",
    slug: `test-movie-${testIdCounter}`,
    sortTitle: `Test Movie ${testIdCounter}`,
    stillImageProps: {
      src: "/still.jpg",
      srcSet: "/still.jpg 1x",
    },
    title: `Test Movie ${testIdCounter}`,
    watchlistCollectionNames: [],
    watchlistDirectorNames: [],
    watchlistPerformerNames: [],
    watchlistWriterNames: [],
    ...overrides,
  };
};

const baseProps: CastAndCrewMemberTitlesProps = {
  distinctCreditKinds: ["Director", "Writer", "Performer"],
  distinctGenres: ["Drama", "Thriller", "Horror", "Comedy", "Action"],
  distinctReleaseYears: ["1950", "1960", "1965", "1970", "1975", "1980"],
  distinctReviewYears: ["2019", "2020", "2021", "2022"],
  initialSort: "release-date-desc",
  values: [],
};

describe("CastAndCrewMemberTitles", () => {
  beforeEach(() => {
    testIdCounter = 0;
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by title", async ({ expect }) => {
      const titles = [
        createTitle({ releaseYear: "1960", title: "Psycho" }),
        createTitle({ releaseYear: "1963", title: "The Birds" }),
        createTitle({ releaseYear: "1958", title: "Vertigo" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Psycho");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(within(reviewCardList).getByText("Psycho")).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("The Birds"),
      ).not.toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("Vertigo"),
      ).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const titles = [
        createTitle({
          genres: ["Horror", "Thriller"],
          releaseYear: "1960",
          title: "Psycho",
        }),
        createTitle({
          genres: ["Thriller", "Action"],
          releaseYear: "1959",
          title: "North by Northwest",
        }),
        createTitle({
          genres: ["Comedy"],
          releaseYear: "1955",
          title: "The Trouble with Harry",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Thriller");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(within(reviewCardList).getByText("Psycho")).toBeInTheDocument();
      expect(
        within(reviewCardList).getByText("North by Northwest"),
      ).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("The Trouble with Harry"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const titles = [
        createTitle({ releaseYear: "1950", title: "Stage Fright" }),
        createTitle({ releaseYear: "1965", title: "Marnie" }),
        createTitle({ releaseYear: "1975", title: "Family Plot" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1950", "1970");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(
        within(reviewCardList).getByText("Stage Fright"),
      ).toBeInTheDocument();
      expect(within(reviewCardList).getByText("Marnie")).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("Family Plot"),
      ).not.toBeInTheDocument();
    });

    it("filters by review year range", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseYear: "1954",
          reviewYear: "2019",
          title: "Rear Window",
        }),
        createTitle({
          releaseYear: "1951",
          reviewYear: "2020",
          title: "Strangers on a Train",
        }),
        createTitle({
          releaseYear: "1955",
          reviewYear: "2022",
          title: "To Catch a Thief",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, "2019", "2021");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(
        within(reviewCardList).getByText("Rear Window"),
      ).toBeInTheDocument();
      expect(
        within(reviewCardList).getByText("Strangers on a Train"),
      ).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("To Catch a Thief"),
      ).not.toBeInTheDocument();
    });

    it("filters by grade range", async ({ expect }) => {
      const titles = [
        createTitle({
          grade: "C-",
          gradeValue: 8,
          releaseYear: "1953",
          title: "I Confess",
        }),
        createTitle({
          grade: "B",
          gradeValue: 12,
          releaseYear: "1954",
          title: "Dial M for Murder",
        }),
        createTitle({
          grade: "A",
          gradeValue: 15,
          releaseYear: "1959",
          title: "North by Northwest",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "B+");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(
        within(reviewCardList).getByText("Dial M for Murder"),
      ).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("I Confess"),
      ).not.toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("North by Northwest"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status - reviewed only", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseYear: "1960",
          reviewSequence: 1,
          reviewYear: "2020",
          slug: "psycho-1960",
          title: "Psycho",
        }),
        createTitle({
          releaseYear: "1963",
          reviewSequence: 2,
          reviewYear: "2021",
          slug: "the-birds-1963",
          title: "The Birds",
        }),
        createTitle({
          releaseYear: "1964",
          reviewSequence: undefined,
          reviewYear: undefined,
          slug: undefined,
          title: "Marnie",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(within(reviewCardList).getByText("Psycho")).toBeInTheDocument();
      expect(within(reviewCardList).getByText("The Birds")).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("Marnie"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status - unreviewed only", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseYear: "1960",
          reviewSequence: 1,
          reviewYear: "2020",
          slug: "psycho-1960",
          title: "Psycho",
        }),
        createTitle({
          releaseYear: "1964",
          reviewSequence: undefined,
          reviewYear: undefined,
          slug: undefined,
          title: "Marnie",
        }),
        createTitle({
          releaseYear: "1966",
          reviewSequence: undefined,
          reviewYear: undefined,
          slug: undefined,
          title: "Torn Curtain",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickReviewedStatusFilterOption(user, "Not Reviewed");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(
        within(reviewCardList).queryByText("Psycho"),
      ).not.toBeInTheDocument();
      expect(within(reviewCardList).getByText("Marnie")).toBeInTheDocument();
      expect(
        within(reviewCardList).getByText("Torn Curtain"),
      ).toBeInTheDocument();
    });

    it("filters by credited as", async ({ expect }) => {
      const titles = [
        createTitle({
          creditedAs: ["Director"],
          releaseYear: "1935",
          title: "The 39 Steps",
        }),
        createTitle({
          creditedAs: ["Writer"],
          releaseYear: "1929",
          title: "Blackmail",
        }),
        createTitle({
          creditedAs: ["Performer"],
          releaseYear: "1955",
          title: "To Catch a Thief",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await clickCreditedAsFilterOption(user, "Director");
      await clickViewResults(user);

      const reviewCardList = getReviewCardList();
      expect(
        within(reviewCardList).getByText("The 39 Steps"),
      ).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("Blackmail"),
      ).not.toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("To Catch a Thief"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseYear: "1958",
          sortTitle: "Vertigo",
          title: "Vertigo",
        }),
        createTitle({
          releaseYear: "1963",
          sortTitle: "Birds",
          title: "The Birds",
        }),
        createTitle({
          releaseYear: "1960",
          sortTitle: "Psycho",
          title: "Psycho",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (A → Z)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const birdsIndex = allText.indexOf("The Birds");
      const psychoIndex = allText.indexOf("Psycho");
      const vertigoIndex = allText.indexOf("Vertigo");

      expect(birdsIndex).toBeLessThan(psychoIndex);
      expect(psychoIndex).toBeLessThan(vertigoIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseYear: "1963",
          sortTitle: "Birds",
          title: "The Birds",
        }),
        createTitle({
          releaseYear: "1960",
          sortTitle: "Psycho",
          title: "Psycho",
        }),
        createTitle({
          releaseYear: "1958",
          sortTitle: "Vertigo",
          title: "Vertigo",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (Z → A)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const vertigoIndex = allText.indexOf("Vertigo");
      const psychoIndex = allText.indexOf("Psycho");
      const birdsIndex = allText.indexOf("The Birds");

      expect(vertigoIndex).toBeLessThan(psychoIndex);
      expect(psychoIndex).toBeLessThan(birdsIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseSequence: 3,
          releaseYear: "1980",
          title: "Family Plot",
        }),
        createTitle({
          releaseSequence: 1,
          releaseYear: "1950",
          title: "Stage Fright",
        }),
        createTitle({
          releaseSequence: 2,
          releaseYear: "1965",
          title: "Marnie",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const stageFrightIndex = allText.indexOf("Stage Fright");
      const marnieIndex = allText.indexOf("Marnie");
      const familyPlotIndex = allText.indexOf("Family Plot");

      expect(stageFrightIndex).toBeLessThan(marnieIndex);
      expect(marnieIndex).toBeLessThan(familyPlotIndex);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseSequence: 1,
          releaseYear: "1950",
          title: "Stage Fright",
        }),
        createTitle({
          releaseSequence: 2,
          releaseYear: "1965",
          title: "Marnie",
        }),
        createTitle({
          releaseSequence: 3,
          releaseYear: "1980",
          title: "Family Plot",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const familyPlotIndex = allText.indexOf("Family Plot");
      const marnieIndex = allText.indexOf("Marnie");
      const stageFrightIndex = allText.indexOf("Stage Fright");

      expect(familyPlotIndex).toBeLessThan(marnieIndex);
      expect(marnieIndex).toBeLessThan(stageFrightIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const titles = [
        createTitle({
          grade: "A",
          gradeValue: 12,
          releaseYear: "1954",
          title: "Rear Window",
        }),
        createTitle({
          grade: "C-",
          gradeValue: 5,
          releaseYear: "1953",
          title: "I Confess",
        }),
        createTitle({
          grade: "B",
          gradeValue: 7,
          releaseYear: "1956",
          title: "The Man Who Knew Too Much",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Best First)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const rearWindowIndex = allText.indexOf("Rear Window");
      const manWhoKnewIndex = allText.indexOf("The Man Who Knew Too Much");
      const iConfessIndex = allText.indexOf("I Confess");

      expect(rearWindowIndex).toBeLessThan(manWhoKnewIndex);
      expect(manWhoKnewIndex).toBeLessThan(iConfessIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const titles = [
        createTitle({
          grade: "A",
          gradeValue: 12,
          releaseYear: "1954",
          title: "Rear Window",
        }),
        createTitle({
          grade: "B",
          gradeValue: 7,
          releaseYear: "1956",
          title: "The Man Who Knew Too Much",
        }),
        createTitle({
          grade: "C-",
          gradeValue: 5,
          releaseYear: "1953",
          title: "I Confess",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Worst First)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const iConfessIndex = allText.indexOf("I Confess");
      const manWhoKnewIndex = allText.indexOf("The Man Who Knew Too Much");
      const rearWindowIndex = allText.indexOf("Rear Window");

      expect(iConfessIndex).toBeLessThan(manWhoKnewIndex);
      expect(manWhoKnewIndex).toBeLessThan(rearWindowIndex);
    });

    it("sorts by review date oldest first", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseYear: "1958",
          reviewSequence: 3,
          title: "Vertigo",
        }),
        createTitle({
          releaseYear: "1960",
          reviewSequence: 1,
          title: "Psycho",
        }),
        createTitle({
          releaseYear: "1959",
          reviewSequence: 2,
          title: "North by Northwest",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Oldest First)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const psychoIndex = allText.indexOf("Psycho");
      const northIndex = allText.indexOf("North by Northwest");
      const vertigoIndex = allText.indexOf("Vertigo");

      expect(psychoIndex).toBeLessThan(northIndex);
      expect(northIndex).toBeLessThan(vertigoIndex);
    });

    it("sorts by review date newest first", async ({ expect }) => {
      const titles = [
        createTitle({
          releaseYear: "1960",
          reviewSequence: 1,
          title: "Psycho",
        }),
        createTitle({
          releaseYear: "1959",
          reviewSequence: 2,
          title: "North by Northwest",
        }),
        createTitle({
          releaseYear: "1958",
          reviewSequence: 3,
          title: "Vertigo",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Newest First)");

      const reviewCardList = getReviewCardList();
      const allText = reviewCardList.textContent || "";
      const vertigoIndex = allText.indexOf("Vertigo");
      const northIndex = allText.indexOf("North by Northwest");
      const psychoIndex = allText.indexOf("Psycho");

      expect(vertigoIndex).toBeLessThan(northIndex);
      expect(northIndex).toBeLessThan(psychoIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const titles = [
        createTitle({
          creditedAs: ["Director"],
          releaseYear: "1946",
          title: "Notorious",
        }),
        createTitle({
          creditedAs: ["Writer"],
          releaseYear: "1943",
          title: "Shadow of a Doubt",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Notorious");
      await clickCreditedAsFilterOption(user, "Director");
      await clickViewResults(user);

      let reviewCardList = getReviewCardList();
      expect(within(reviewCardList).getByText("Notorious")).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("Shadow of a Doubt"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");
      expect(getCreditedAsFilter()).toEqual([]);

      await clickViewResults(user);

      reviewCardList = getReviewCardList();
      expect(within(reviewCardList).getByText("Notorious")).toBeInTheDocument();
      expect(
        within(reviewCardList).getByText("Shadow of a Doubt"),
      ).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const titles = [
        createTitle({ releaseYear: "1960", title: "Psycho" }),
        createTitle({ releaseYear: "1963", title: "The Birds" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Psycho");
      await clickViewResults(user);

      let reviewCardList = getReviewCardList();
      expect(within(reviewCardList).getByText("Psycho")).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("The Birds"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      reviewCardList = getReviewCardList();
      expect(within(reviewCardList).getByText("Psycho")).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("The Birds"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Psycho");
    });
  });
});
