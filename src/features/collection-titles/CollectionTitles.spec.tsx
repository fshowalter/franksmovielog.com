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
import { getPosterList } from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type {
  CollectionTitlesProps,
  CollectionTitlesValue,
} from "./CollectionTitles";

import { CollectionTitles } from "./CollectionTitles";

const createCollectionTitles = (
  overrides: Partial<CollectionTitlesValue>[] = [],
): CollectionTitlesValue[] => {
  return overrides.map((override, index) => {
    return {
      genres: ["Action", "Adventure"],
      grade: "B",
      gradeValue: 7,
      imdbId: `tt${String(index).padStart(7, "0")}`,
      posterImageProps: {
        src: "/poster.jpg",
        srcSet: "/poster.jpg 1x",
      },
      releaseSequence: index,
      releaseYear: "1962",
      reviewDisplayDate: "Aug 22, 2024",
      reviewSequence: index.toString(),
      reviewSlug: `test-slug-${index}`,
      reviewYear: "2024",
      sortTitle: "Dr. No",
      title: "Dr. No",
      ...override,
    };
  });
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
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by title", async ({ expect }) => {
      const titles = createCollectionTitles([
        { releaseYear: "1962", title: "Dr. No" },
        {
          releaseYear: "1963",
          title: "From Russia with Love",
        },
        { releaseYear: "1964", title: "Goldfinger" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Goldfinger");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(within(posterList).queryByText("Dr. No")).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("From Russia with Love"),
      ).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          genres: ["Action", "Thriller"],
          title: "Dr. No",
        },
        {
          genres: ["Action", "Adventure"],
          title: "Goldfinger",
        },
        {
          genres: ["Comedy", "Action"],
          title: "Casino Royale",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Thriller");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Casino Royale"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const titles = createCollectionTitles([
        { releaseYear: "1962", title: "Dr. No" },
        { releaseYear: "1964", title: "Goldfinger" },
        {
          releaseYear: "1977",
          title: "The Spy Who Loved Me",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1962", "1965");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Spy Who Loved Me"),
      ).not.toBeInTheDocument();
    });

    it("filters by review year range", async ({ expect }) => {
      const titles = createCollectionTitles([
        { reviewYear: "2022", title: "Dr. No" },
        { reviewYear: "2023", title: "Goldfinger" },
        { reviewYear: "2024", title: "GoldenEye" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, "2022", "2023");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("GoldenEye"),
      ).not.toBeInTheDocument();
    });

    it("filters by grade range", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          grade: "C-",
          gradeValue: 8,
          title: "Die Another Day",
        },
        { grade: "B", gradeValue: 12, title: "Dr. No" },
        {
          grade: "A",
          gradeValue: 15,
          title: "Goldfinger",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "B+");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Die Another Day"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status - reviewed only", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          reviewSequence: "1",
          reviewSlug: "dr-no-1962",
          reviewYear: "2024",
          title: "Dr. No",
        },
        {
          reviewSequence: "2",
          reviewSlug: "goldfinger-1964",
          reviewYear: "2024",
          title: "Goldfinger",
        },
        {
          reviewSequence: undefined,
          reviewSlug: undefined,
          reviewYear: undefined,
          title: "Thunderball",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Thunderball"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status - unreviewed only", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          reviewSequence: "1",
          reviewSlug: "dr-no-1962",
          reviewYear: "2024",
          title: "Dr. No",
        },
        {
          reviewSequence: undefined,
          reviewSlug: undefined,
          reviewYear: undefined,
          title: "Thunderball",
        },
        {
          reviewSequence: undefined,
          reviewSlug: undefined,
          reviewYear: undefined,
          title: "Never Say Never Again",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickReviewedStatusFilterOption(user, "Not Reviewed");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).queryByText("Dr. No")).not.toBeInTheDocument();
      expect(within(posterList).getByText("Thunderball")).toBeInTheDocument();
      expect(
        within(posterList).getByText("Never Say Never Again"),
      ).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          sortTitle: "Spy Who Loved Me",
          title: "The Spy Who Loved Me",
        },
        { sortTitle: "Dr. No", title: "Dr. No" },
        { sortTitle: "Moonraker", title: "Moonraker" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (A → Z)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const drNoIndex = allText.indexOf("Dr. No");
      const moonrakerIndex = allText.indexOf("Moonraker");
      const spyIndex = allText.indexOf("The Spy Who Loved Me");

      expect(drNoIndex).toBeLessThan(moonrakerIndex);
      expect(moonrakerIndex).toBeLessThan(spyIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const titles = createCollectionTitles([
        { sortTitle: "Dr. No", title: "Dr. No" },
        { sortTitle: "Moonraker", title: "Moonraker" },
        {
          sortTitle: "Spy Who Loved Me",
          title: "The Spy Who Loved Me",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (Z → A)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const spyIndex = allText.indexOf("The Spy Who Loved Me");
      const moonrakerIndex = allText.indexOf("Moonraker");
      const drNoIndex = allText.indexOf("Dr. No");

      expect(spyIndex).toBeLessThan(moonrakerIndex);
      expect(moonrakerIndex).toBeLessThan(drNoIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          releaseSequence: 3,
          releaseYear: "1995",
          title: "GoldenEye",
        },
        {
          releaseSequence: 1,
          releaseYear: "1962",
          title: "Dr. No",
        },
        {
          releaseSequence: 2,
          releaseYear: "1987",
          title: "The Living Daylights",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const drNoIndex = allText.indexOf("Dr. No");
      const livingIndex = allText.indexOf("The Living Daylights");
      const goldIndex = allText.indexOf("GoldenEye");

      expect(drNoIndex).toBeLessThan(livingIndex);
      expect(livingIndex).toBeLessThan(goldIndex);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          releaseSequence: 1,
          releaseYear: "1962",
          title: "Dr. No",
        },
        {
          releaseSequence: 2,
          releaseYear: "1987",
          title: "The Living Daylights",
        },
        {
          releaseSequence: 3,
          releaseYear: "1995",
          title: "GoldenEye",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const goldIndex = allText.indexOf("GoldenEye");
      const livingIndex = allText.indexOf("The Living Daylights");
      const drNoIndex = allText.indexOf("Dr. No");

      expect(goldIndex).toBeLessThan(livingIndex);
      expect(livingIndex).toBeLessThan(drNoIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          grade: "A",
          gradeValue: 12,
          title: "Goldfinger",
        },
        {
          grade: "D",
          gradeValue: 3,
          title: "Die Another Day",
        },
        { grade: "B", gradeValue: 7, title: "Dr. No" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Best First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const goldfingerIndex = allText.indexOf("Goldfinger");
      const drNoIndex = allText.indexOf("Dr. No");
      const dieIndex = allText.indexOf("Die Another Day");

      expect(goldfingerIndex).toBeLessThan(drNoIndex);
      expect(drNoIndex).toBeLessThan(dieIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          grade: "A",
          gradeValue: 12,
          title: "Goldfinger",
        },
        { grade: "B", gradeValue: 7, title: "Dr. No" },
        {
          grade: "D",
          gradeValue: 3,
          title: "Die Another Day",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Worst First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const dieIndex = allText.indexOf("Die Another Day");
      const drNoIndex = allText.indexOf("Dr. No");
      const goldfingerIndex = allText.indexOf("Goldfinger");

      expect(dieIndex).toBeLessThan(drNoIndex);
      expect(drNoIndex).toBeLessThan(goldfingerIndex);
    });

    it("sorts by review date oldest first", async ({ expect }) => {
      const titles = createCollectionTitles([
        { reviewSequence: "3", title: "Casino Royale" },
        { reviewSequence: "1", title: "Dr. No" },
        { reviewSequence: "2", title: "Skyfall" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Oldest First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const drNoIndex = allText.indexOf("Dr. No");
      const skyfallIndex = allText.indexOf("Skyfall");
      const casinoIndex = allText.indexOf("Casino Royale");

      expect(drNoIndex).toBeLessThan(skyfallIndex);
      expect(skyfallIndex).toBeLessThan(casinoIndex);
    });

    it("sorts by review date newest first", async ({ expect }) => {
      const titles = createCollectionTitles([
        { reviewSequence: "1", title: "Dr. No" },
        { reviewSequence: "2", title: "Skyfall" },
        { reviewSequence: "3", title: "Casino Royale" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Newest First)");

      const posterList = getPosterList();
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
      const titles = createCollectionTitles([
        { genres: ["Action"], title: "Dr. No" },
        { genres: ["Thriller"], title: "Goldfinger" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dr. No");
      await clickGenresFilterOption(user, "Action");
      await clickViewResults(user);

      let posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const titles = createCollectionTitles([
        { title: "Dr. No" },
        { title: "Goldfinger" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dr. No");
      await clickViewResults(user);

      let posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Dr. No");
    });
  });
});
