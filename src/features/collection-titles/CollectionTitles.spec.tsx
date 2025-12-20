import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

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
import {
  clickShowMore,
  getGroupedPosterList,
} from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type {
  CollectionTitlesProps,
  CollectionTitlesValue,
} from "./CollectionTitles";

import { CollectionTitles } from "./CollectionTitles";

// Inline minimal fixture data for testing - using James Bond films
let testIdCounter = 0;
const createCollectionTitle = (
  overrides: Partial<CollectionTitlesValue> = {},
): CollectionTitlesValue => {
  testIdCounter += 1;
  return {
    genres: ["Action", "Adventure"],
    grade: "B",
    gradeValue: 7,
    imdbId: `tt${String(testIdCounter).padStart(7, "0")}`,
    posterImageProps: {
      src: "/poster.jpg",
      srcSet: "/poster.jpg 1x",
    },
    releaseSequence: testIdCounter,
    releaseYear: "1962",
    reviewDisplayDate: "Aug 22, 2024",
    reviewSequence: testIdCounter,
    reviewYear: "2024",
    slug: "dr-no-1962",
    sortTitle: "Dr. No",
    title: "Dr. No",
    ...overrides,
  };
};

const baseProps: CollectionTitlesProps = {
  distinctGenres: ["Action", "Adventure", "Thriller", "Comedy", "Drama"],
  distinctReleaseYears: [
    "1962",
    "1963",
    "1964",
    "1965",
    "1969",
    "1971",
    "1973",
    "1974",
  ],
  distinctReviewYears: ["2022", "2023", "2024"],
  initialSort: "release-date-desc",
  values: [],
};

describe("CollectionTitles", () => {
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
        createCollectionTitle({ releaseYear: "1962", title: "Dr. No" }),
        createCollectionTitle({
          releaseYear: "1963",
          title: "From Russia with Love",
        }),
        createCollectionTitle({ releaseYear: "1964", title: "Goldfinger" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Goldfinger");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(within(posterList).queryByText("Dr. No")).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("From Russia with Love"),
      ).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          genres: ["Action", "Thriller"],
          title: "Dr. No",
        }),
        createCollectionTitle({
          genres: ["Action", "Adventure"],
          title: "Goldfinger",
        }),
        createCollectionTitle({
          genres: ["Comedy", "Action"],
          title: "Casino Royale",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Thriller");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Casino Royale"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const titles = [
        createCollectionTitle({ releaseYear: "1962", title: "Dr. No" }),
        createCollectionTitle({ releaseYear: "1964", title: "Goldfinger" }),
        createCollectionTitle({
          releaseYear: "1977",
          title: "The Spy Who Loved Me",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1962", "1965");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Spy Who Loved Me"),
      ).not.toBeInTheDocument();
    });

    it("filters by review year range", async ({ expect }) => {
      const titles = [
        createCollectionTitle({ reviewYear: "2022", title: "Dr. No" }),
        createCollectionTitle({ reviewYear: "2023", title: "Goldfinger" }),
        createCollectionTitle({ reviewYear: "2024", title: "GoldenEye" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, "2022", "2023");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("GoldenEye"),
      ).not.toBeInTheDocument();
    });

    it("filters by grade range", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          grade: "C-",
          gradeValue: 5,
          title: "Die Another Day",
        }),
        createCollectionTitle({ grade: "B", gradeValue: 9, title: "Dr. No" }),
        createCollectionTitle({
          grade: "A",
          gradeValue: 12,
          title: "Goldfinger",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "B+");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Die Another Day"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status - reviewed only", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          reviewSequence: 1,
          reviewYear: "2024",
          slug: "dr-no-1962",
          title: "Dr. No",
        }),
        createCollectionTitle({
          reviewSequence: 2,
          reviewYear: "2024",
          slug: "goldfinger-1964",
          title: "Goldfinger",
        }),
        createCollectionTitle({
          reviewSequence: undefined,
          reviewYear: undefined,
          slug: undefined,
          title: "Thunderball",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Thunderball"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status - unreviewed only", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          reviewSequence: 1,
          reviewYear: "2024",
          slug: "dr-no-1962",
          title: "Dr. No",
        }),
        createCollectionTitle({
          reviewSequence: undefined,
          reviewYear: undefined,
          slug: undefined,
          title: "Thunderball",
        }),
        createCollectionTitle({
          reviewSequence: undefined,
          reviewYear: undefined,
          slug: undefined,
          title: "Never Say Never Again",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickReviewedStatusFilterOption(user, "Not Reviewed");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).queryByText("Dr. No")).not.toBeInTheDocument();
      expect(within(posterList).getByText("Thunderball")).toBeInTheDocument();
      expect(
        within(posterList).getByText("Never Say Never Again"),
      ).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          sortTitle: "Spy Who Loved Me",
          title: "The Spy Who Loved Me",
        }),
        createCollectionTitle({ sortTitle: "Dr. No", title: "Dr. No" }),
        createCollectionTitle({ sortTitle: "Moonraker", title: "Moonraker" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (A → Z)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const drNoIndex = allText.indexOf("Dr. No");
      const moonrakerIndex = allText.indexOf("Moonraker");
      const spyIndex = allText.indexOf("The Spy Who Loved Me");

      expect(drNoIndex).toBeLessThan(moonrakerIndex);
      expect(moonrakerIndex).toBeLessThan(spyIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const titles = [
        createCollectionTitle({ sortTitle: "Dr. No", title: "Dr. No" }),
        createCollectionTitle({ sortTitle: "Moonraker", title: "Moonraker" }),
        createCollectionTitle({
          sortTitle: "Spy Who Loved Me",
          title: "The Spy Who Loved Me",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (Z → A)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const spyIndex = allText.indexOf("The Spy Who Loved Me");
      const moonrakerIndex = allText.indexOf("Moonraker");
      const drNoIndex = allText.indexOf("Dr. No");

      expect(spyIndex).toBeLessThan(moonrakerIndex);
      expect(moonrakerIndex).toBeLessThan(drNoIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          releaseSequence: 3,
          releaseYear: "1995",
          title: "GoldenEye",
        }),
        createCollectionTitle({
          releaseSequence: 1,
          releaseYear: "1962",
          title: "Dr. No",
        }),
        createCollectionTitle({
          releaseSequence: 2,
          releaseYear: "1987",
          title: "The Living Daylights",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const drNoIndex = allText.indexOf("Dr. No");
      const livingIndex = allText.indexOf("The Living Daylights");
      const goldIndex = allText.indexOf("GoldenEye");

      expect(drNoIndex).toBeLessThan(livingIndex);
      expect(livingIndex).toBeLessThan(goldIndex);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          releaseSequence: 1,
          releaseYear: "1962",
          title: "Dr. No",
        }),
        createCollectionTitle({
          releaseSequence: 2,
          releaseYear: "1987",
          title: "The Living Daylights",
        }),
        createCollectionTitle({
          releaseSequence: 3,
          releaseYear: "1995",
          title: "GoldenEye",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const goldIndex = allText.indexOf("GoldenEye");
      const livingIndex = allText.indexOf("The Living Daylights");
      const drNoIndex = allText.indexOf("Dr. No");

      expect(goldIndex).toBeLessThan(livingIndex);
      expect(livingIndex).toBeLessThan(drNoIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          grade: "A",
          gradeValue: 12,
          title: "Goldfinger",
        }),
        createCollectionTitle({
          grade: "D",
          gradeValue: 3,
          title: "Die Another Day",
        }),
        createCollectionTitle({ grade: "B", gradeValue: 7, title: "Dr. No" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Best First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const goldfingerIndex = allText.indexOf("Goldfinger");
      const drNoIndex = allText.indexOf("Dr. No");
      const dieIndex = allText.indexOf("Die Another Day");

      expect(goldfingerIndex).toBeLessThan(drNoIndex);
      expect(drNoIndex).toBeLessThan(dieIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const titles = [
        createCollectionTitle({
          grade: "A",
          gradeValue: 12,
          title: "Goldfinger",
        }),
        createCollectionTitle({ grade: "B", gradeValue: 7, title: "Dr. No" }),
        createCollectionTitle({
          grade: "D",
          gradeValue: 3,
          title: "Die Another Day",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Worst First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const dieIndex = allText.indexOf("Die Another Day");
      const drNoIndex = allText.indexOf("Dr. No");
      const goldfingerIndex = allText.indexOf("Goldfinger");

      expect(dieIndex).toBeLessThan(drNoIndex);
      expect(drNoIndex).toBeLessThan(goldfingerIndex);
    });

    it("sorts by review date oldest first", async ({ expect }) => {
      const titles = [
        createCollectionTitle({ reviewSequence: 3, title: "Casino Royale" }),
        createCollectionTitle({ reviewSequence: 1, title: "Dr. No" }),
        createCollectionTitle({ reviewSequence: 2, title: "Skyfall" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const drNoIndex = allText.indexOf("Dr. No");
      const skyfallIndex = allText.indexOf("Skyfall");
      const casinoIndex = allText.indexOf("Casino Royale");

      expect(drNoIndex).toBeLessThan(skyfallIndex);
      expect(skyfallIndex).toBeLessThan(casinoIndex);
    });

    it("sorts by review date newest first", async ({ expect }) => {
      const titles = [
        createCollectionTitle({ reviewSequence: 1, title: "Dr. No" }),
        createCollectionTitle({ reviewSequence: 2, title: "Skyfall" }),
        createCollectionTitle({ reviewSequence: 3, title: "Casino Royale" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const casinoIndex = allText.indexOf("Casino Royale");
      const skyfallIndex = allText.indexOf("Skyfall");
      const drNoIndex = allText.indexOf("Dr. No");

      expect(casinoIndex).toBeLessThan(skyfallIndex);
      expect(skyfallIndex).toBeLessThan(drNoIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const titles = [
        createCollectionTitle({ genres: ["Action"], title: "Dr. No" }),
        createCollectionTitle({ genres: ["Thriller"], title: "Goldfinger" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dr. No");
      await clickGenresFilterOption(user, "Action");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const titles = [
        createCollectionTitle({ title: "Dr. No" }),
        createCollectionTitle({ title: "Goldfinger" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dr. No");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Dr. No");
    });
  });
});
