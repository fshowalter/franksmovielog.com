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
  fillReleaseYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import {
  clickShowMore,
  getGroupedPosterList,
} from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import { Overrated } from "./Overrated";
import { baseProps, createReviewValue, resetTestIdCounter } from "./testHelper";

describe("Overrated", () => {
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
        createReviewValue({ releaseYear: "1956", title: "The Bad Seed" }),
        createReviewValue({ releaseYear: "1941", title: "Citizen Kane" }),
        createReviewValue({
          releaseYear: "1994",
          title: "The Shawshank Redemption",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Bad Seed");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Bad Seed")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Citizen Kane"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Shawshank Redemption"),
      ).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          genres: ["Drama", "Crime"],
          title: "The Godfather",
        }),
        createReviewValue({ genres: ["Action", "Sci-Fi"], title: "Avatar" }),
        createReviewValue({ genres: ["Drama", "Romance"], title: "Titanic" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Drama");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Godfather")).toBeInTheDocument();
      expect(within(posterList).getByText("Titanic")).toBeInTheDocument();
      expect(within(posterList).queryByText("Avatar")).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const reviews = [
        createReviewValue({ releaseYear: "1940", title: "Old Movie" }),
        createReviewValue({ releaseYear: "1970", title: "Mid Movie" }),
        createReviewValue({ releaseYear: "2020", title: "New Movie" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1960", "1980");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Mid Movie")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Old Movie"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("New Movie"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "Zorro", title: "Zorro" }),
        createReviewValue({ sortTitle: "Avatar", title: "Avatar" }),
        createReviewValue({ sortTitle: "Matrix", title: "The Matrix" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (A → Z)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const avatarIndex = allText.indexOf("Avatar");
      const matrixIndex = allText.indexOf("The Matrix");
      const zorroIndex = allText.indexOf("Zorro");

      expect(avatarIndex).toBeLessThan(matrixIndex);
      expect(matrixIndex).toBeLessThan(zorroIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "Avatar", title: "Avatar" }),
        createReviewValue({ sortTitle: "Matrix", title: "The Matrix" }),
        createReviewValue({ sortTitle: "Zorro", title: "Zorro" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (Z → A)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const zorroIndex = allText.indexOf("Zorro");
      const matrixIndex = allText.indexOf("The Matrix");
      const avatarIndex = allText.indexOf("Avatar");

      expect(zorroIndex).toBeLessThan(matrixIndex);
      expect(matrixIndex).toBeLessThan(avatarIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseDate: "2000-12-31",
          releaseYear: "2000",
          title: "New",
        }),
        createReviewValue({
          releaseDate: "1950-01-15",
          releaseYear: "1950",
          title: "Old",
        }),
        createReviewValue({
          releaseDate: "1975-06-20",
          releaseYear: "1975",
          title: "Mid",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const oldIndex = allText.indexOf("Old");
      const midIndex = allText.indexOf("Mid");
      const newIndex = allText.indexOf("New");

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseDate: "1950-01-15",
          releaseYear: "1950",
          title: "Old",
        }),
        createReviewValue({
          releaseDate: "1975-06-20",
          releaseYear: "1975",
          title: "Mid",
        }),
        createReviewValue({
          releaseDate: "2000-12-31",
          releaseYear: "2000",
          title: "New",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const newIndex = allText.indexOf("New");
      const midIndex = allText.indexOf("Mid");
      const oldIndex = allText.indexOf("Old");

      expect(newIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(oldIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A", gradeValue: 12, title: "Best" }),
        createReviewValue({ grade: "F", gradeValue: 1, title: "Worst" }),
        createReviewValue({ grade: "C", gradeValue: 6, title: "Mid" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Best First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const bestIndex = allText.indexOf("Best");
      const midIndex = allText.indexOf("Mid");
      const worstIndex = allText.indexOf("Worst");

      expect(bestIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(worstIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A", gradeValue: 12, title: "Best" }),
        createReviewValue({ grade: "C", gradeValue: 6, title: "Mid" }),
        createReviewValue({ grade: "F", gradeValue: 1, title: "Worst" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Worst First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const worstIndex = allText.indexOf("Worst");
      const midIndex = allText.indexOf("Mid");
      const bestIndex = allText.indexOf("Best");

      expect(worstIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(bestIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const reviews = [
        createReviewValue({ genres: ["Drama"], title: "Bad Seed" }),
        createReviewValue({ genres: ["Drama"], title: "Citizen Kane" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Bad Seed");
      await clickGenresFilterOption(user, "Drama");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Bad Seed")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Citizen Kane"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Bad Seed")).toBeInTheDocument();
      expect(within(posterList).getByText("Citizen Kane")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const reviews = [
        createReviewValue({ title: "Bad Seed" }),
        createReviewValue({ title: "Citizen Kane" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Bad Seed");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Bad Seed")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Citizen Kane"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Bad Seed")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Citizen Kane"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Bad Seed");
    });
  });

  describe("pagination", () => {
    it("shows more titles when clicking show more", async ({ expect }) => {
      // Create 110 reviews to force pagination
      const reviews = Array.from({ length: 110 }, (_, i) =>
        createReviewValue({
          releaseDate: `${2020 - Math.floor(i / 10)}-01-${String((i % 30) + 1).padStart(2, "0")}`,
          releaseYear: String(2020 - Math.floor(i / 10)),
          reviewMonth: "January",
          reviewSequence: 110 - i, // Highest sequence first for desc sort
          reviewYear: "2020",
          title: `Overrated ${i + 1}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Overrated {...baseProps} values={reviews} />);

      const posterList = getGroupedPosterList();

      // Should show first 100 movies
      expect(within(posterList).getByText("Overrated 1")).toBeInTheDocument();
      expect(within(posterList).getByText("Overrated 100")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Overrated 101"),
      ).not.toBeInTheDocument();

      await clickShowMore(user);

      // Should now show all movies
      expect(within(posterList).getByText("Overrated 101")).toBeInTheDocument();
      expect(within(posterList).getByText("Overrated 110")).toBeInTheDocument();
    });
  });
});
