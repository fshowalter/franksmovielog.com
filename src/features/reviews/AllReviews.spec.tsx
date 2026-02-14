import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
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

import { AllReviews } from "./AllReviews";
import { baseProps, createReviewValue, resetTestIdCounter } from "./testHelper";

describe("AllReviews", () => {
  beforeEach(() => {
    resetTestIdCounter();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by title", async ({ expect }) => {
      const reviews = [
        createReviewValue({ releaseYear: "1997", title: "The Apostle" }),
        createReviewValue({ releaseYear: "1978", title: "Halloween" }),
        createReviewValue({ releaseYear: "1982", title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Apostle");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Apostle")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Halloween"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const reviews = [
        createReviewValue({ genres: ["Horror"], title: "The Exorcist" }),
        createReviewValue({ genres: ["Horror", "Sci-Fi"], title: "Alien" }),
        createReviewValue({
          genres: ["Sci-Fi", "Adventure"],
          title: "Star Wars",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Horror");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(posterList).getByText("Alien")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Star Wars"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const reviews = [
        createReviewValue({ releaseYear: "1972", title: "The Godfather" }),
        createReviewValue({ releaseYear: "1975", title: "Jaws" }),
        createReviewValue({ releaseYear: "1999", title: "The Matrix" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1970", "1980");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Godfather")).toBeInTheDocument();
      expect(within(posterList).getByText("Jaws")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Matrix"),
      ).not.toBeInTheDocument();
    });

    it("filters by review year range", async ({ expect }) => {
      const reviews = [
        createReviewValue({ reviewYear: "2019", title: "Review 2019" }),
        createReviewValue({ reviewYear: "2020", title: "Review 2020" }),
        createReviewValue({ reviewYear: "2022", title: "Review 2022" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, "2019", "2021");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Review 2019")).toBeInTheDocument();
      expect(within(posterList).getByText("Review 2020")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Review 2022"),
      ).not.toBeInTheDocument();
    });

    it("filters by grade range", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "D", gradeValue: 6, title: "Bad Movie" }),
        createReviewValue({ grade: "B", gradeValue: 12, title: "Good Movie" }),
        createReviewValue({ grade: "A", gradeValue: 15, title: "Great Movie" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "B+");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Good Movie")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Bad Movie"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Great Movie"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "Zodiac", title: "Zodiac" }),
        createReviewValue({ sortTitle: "Alien", title: "Alien" }),
        createReviewValue({ sortTitle: "Matrix", title: "The Matrix" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (A → Z)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const alienIndex = allText.indexOf("Alien");
      const matrixIndex = allText.indexOf("The Matrix");
      const zodiacIndex = allText.indexOf("Zodiac");

      expect(alienIndex).toBeLessThan(matrixIndex);
      expect(matrixIndex).toBeLessThan(zodiacIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "Alien", title: "Alien" }),
        createReviewValue({ sortTitle: "Matrix", title: "The Matrix" }),
        createReviewValue({ sortTitle: "Zodiac", title: "Zodiac" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (Z → A)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const zodiacIndex = allText.indexOf("Zodiac");
      const matrixIndex = allText.indexOf("The Matrix");
      const alienIndex = allText.indexOf("Alien");

      expect(zodiacIndex).toBeLessThan(matrixIndex);
      expect(matrixIndex).toBeLessThan(alienIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseSequence: 2,
          releaseYear: "1990",
          title: "Movie 1990",
        }),
        createReviewValue({
          releaseSequence: 1,
          releaseYear: "1970",
          title: "Movie 1970",
        }),
        createReviewValue({
          releaseSequence: 3,
          releaseYear: "2010",
          title: "Movie 2010",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const movie1970Index = allText.indexOf("Movie 1970");
      const movie1990Index = allText.indexOf("Movie 1990");
      const movie2010Index = allText.indexOf("Movie 2010");

      expect(movie1970Index).toBeLessThan(movie1990Index);
      expect(movie1990Index).toBeLessThan(movie2010Index);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseSequence: 1,
          releaseYear: "1970",
          title: "Movie 1970",
        }),
        createReviewValue({
          releaseSequence: 2,
          releaseYear: "1990",
          title: "Movie 1990",
        }),
        createReviewValue({
          releaseSequence: 3,
          releaseYear: "2010",
          title: "Movie 2010",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const movie2010Index = allText.indexOf("Movie 2010");
      const movie1990Index = allText.indexOf("Movie 1990");
      const movie1970Index = allText.indexOf("Movie 1970");

      expect(movie2010Index).toBeLessThan(movie1990Index);
      expect(movie1990Index).toBeLessThan(movie1970Index);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A", gradeValue: 12, title: "Great" }),
        createReviewValue({ grade: "D", gradeValue: 3, title: "Bad" }),
        createReviewValue({ grade: "B", gradeValue: 9, title: "Good" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Best First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const greatIndex = allText.indexOf("Great");
      const goodIndex = allText.indexOf("Good");
      const badIndex = allText.indexOf("Bad");

      expect(greatIndex).toBeLessThan(goodIndex);
      expect(goodIndex).toBeLessThan(badIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A", gradeValue: 12, title: "Great" }),
        createReviewValue({ grade: "B", gradeValue: 9, title: "Good" }),
        createReviewValue({ grade: "D", gradeValue: 3, title: "Bad" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Worst First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const badIndex = allText.indexOf("Bad");
      const goodIndex = allText.indexOf("Good");
      const greatIndex = allText.indexOf("Great");

      expect(badIndex).toBeLessThan(goodIndex);
      expect(goodIndex).toBeLessThan(greatIndex);
    });

    it("sorts by review date oldest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ reviewSequence: 3, title: "Review 3" }),
        createReviewValue({ reviewSequence: 1, title: "Review 1" }),
        createReviewValue({ reviewSequence: 2, title: "Review 2" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Review Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const review1Index = allText.indexOf("Review 1");
      const review2Index = allText.indexOf("Review 2");
      const review3Index = allText.indexOf("Review 3");

      expect(review1Index).toBeLessThan(review2Index);
      expect(review2Index).toBeLessThan(review3Index);
    });

    it("sorts by review date newest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ reviewSequence: 1, title: "Review 1" }),
        createReviewValue({ reviewSequence: 2, title: "Review 2" }),
        createReviewValue({ reviewSequence: 3, title: "Review 3" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickSortOption(user, "Review Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const review3Index = allText.indexOf("Review 3");
      const review2Index = allText.indexOf("Review 2");
      const review1Index = allText.indexOf("Review 1");

      expect(review3Index).toBeLessThan(review2Index);
      expect(review2Index).toBeLessThan(review1Index);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const reviews = [
        createReviewValue({ genres: ["Horror"], title: "Halloween" }),
        createReviewValue({ genres: ["Sci-Fi"], title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Halloween");
      await clickGenresFilterOption(user, "Horror");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Halloween")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Halloween")).toBeInTheDocument();
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const reviews = [
        createReviewValue({ title: "Halloween" }),
        createReviewValue({ title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Halloween");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Halloween")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Halloween")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Halloween");
    });
  });

  describe("pagination", () => {
    it("shows more titles when clicking show more", async ({ expect }) => {
      // Create 110 reviews to force pagination
      const reviews = Array.from({ length: 110 }, (_, i) =>
        createReviewValue({
          reviewSequence: 3000 - i, // Higher sequences for newer reviews
          reviewYear: String(2020 - Math.floor(i / 10)),
          title: `Movie ${i + 1}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<AllReviews {...baseProps} values={reviews} />);

      const posterList = getGroupedPosterList();

      // Should show first 100 movies
      expect(within(posterList).getByText("Movie 1")).toBeInTheDocument();
      expect(within(posterList).getByText("Movie 100")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Movie 101"),
      ).not.toBeInTheDocument();

      await clickShowMore(user);

      // Should now show all movies
      expect(within(posterList).getByText("Movie 101")).toBeInTheDocument();
      expect(within(posterList).getByText("Movie 110")).toBeInTheDocument();
    });
  });
});
