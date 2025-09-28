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

import { baseProps, createReviewValue, resetTestIdCounter } from "./testHelper";
import { Underseen } from "./Underseen";

describe("Underseen", () => {
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
        createReviewValue({ releaseYear: "1977", title: "Sorcerer" }),
        createReviewValue({ releaseYear: "1953", title: "The Wages of Fear" }),
        createReviewValue({ releaseYear: "1981", title: "Thief" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Sorcerer");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Sorcerer")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Wages of Fear"),
      ).not.toBeInTheDocument();
      expect(within(posterList).queryByText("Thief")).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          genres: ["Thriller", "Adventure"],
          title: "Sorcerer",
        }),
        createReviewValue({
          genres: ["Crime", "Drama"],
          title: "The Friends of Eddie Coyle",
        }),
        createReviewValue({
          genres: ["Thriller", "Mystery"],
          title: "Blow Out",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Thriller");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Sorcerer")).toBeInTheDocument();
      expect(within(posterList).getByText("Blow Out")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Friends of Eddie Coyle"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseYear: "1955",
          title: "The Night of the Hunter",
        }),
        createReviewValue({ releaseYear: "1977", title: "Sorcerer" }),
        createReviewValue({ releaseYear: "1987", title: "Near Dark" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1970", "1980");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Sorcerer")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Night of the Hunter"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Near Dark"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "Thief", title: "Thief" }),
        createReviewValue({ sortTitle: "Blow Out", title: "Blow Out" }),
        createReviewValue({ sortTitle: "Sorcerer", title: "Sorcerer" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (A → Z)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const blowIndex = allText.indexOf("Blow Out");
      const sorcererIndex = allText.indexOf("Sorcerer");
      const thiefIndex = allText.indexOf("Thief");

      expect(blowIndex).toBeLessThan(sorcererIndex);
      expect(sorcererIndex).toBeLessThan(thiefIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "Blow Out", title: "Blow Out" }),
        createReviewValue({ sortTitle: "Sorcerer", title: "Sorcerer" }),
        createReviewValue({ sortTitle: "Thief", title: "Thief" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (Z → A)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const thiefIndex = allText.indexOf("Thief");
      const sorcererIndex = allText.indexOf("Sorcerer");
      const blowIndex = allText.indexOf("Blow Out");

      expect(thiefIndex).toBeLessThan(sorcererIndex);
      expect(sorcererIndex).toBeLessThan(blowIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseDate: "1987-10-02",
          releaseYear: "1987",
          title: "Near Dark",
        }),
        createReviewValue({
          releaseDate: "1951-06-29",
          releaseYear: "1951",
          title: "Ace in the Hole",
        }),
        createReviewValue({
          releaseDate: "1977-06-24",
          releaseYear: "1977",
          title: "Sorcerer",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const aceIndex = allText.indexOf("Ace in the Hole");
      const sorcererIndex = allText.indexOf("Sorcerer");
      const nearIndex = allText.indexOf("Near Dark");

      expect(aceIndex).toBeLessThan(sorcererIndex);
      expect(sorcererIndex).toBeLessThan(nearIndex);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseDate: "1951-06-29",
          releaseYear: "1951",
          title: "Ace in the Hole",
        }),
        createReviewValue({
          releaseDate: "1977-06-24",
          releaseYear: "1977",
          title: "Sorcerer",
        }),
        createReviewValue({
          releaseDate: "1987-10-02",
          releaseYear: "1987",
          title: "Near Dark",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const nearIndex = allText.indexOf("Near Dark");
      const sorcererIndex = allText.indexOf("Sorcerer");
      const aceIndex = allText.indexOf("Ace in the Hole");

      expect(nearIndex).toBeLessThan(sorcererIndex);
      expect(sorcererIndex).toBeLessThan(aceIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A+", gradeValue: 13, title: "Sorcerer" }),
        createReviewValue({ grade: "A", gradeValue: 12, title: "Thief" }),
        createReviewValue({ grade: "B+", gradeValue: 10, title: "Blow Out" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Best First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const sorcererIndex = allText.indexOf("Sorcerer");
      const thiefIndex = allText.indexOf("Thief");
      const blowIndex = allText.indexOf("Blow Out");

      expect(sorcererIndex).toBeLessThan(thiefIndex);
      expect(thiefIndex).toBeLessThan(blowIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A+", gradeValue: 13, title: "Sorcerer" }),
        createReviewValue({ grade: "B+", gradeValue: 10, title: "Blow Out" }),
        createReviewValue({ grade: "A", gradeValue: 12, title: "Thief" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Worst First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const blowIndex = allText.indexOf("Blow Out");
      const thiefIndex = allText.indexOf("Thief");
      const sorcererIndex = allText.indexOf("Sorcerer");

      expect(blowIndex).toBeLessThan(thiefIndex);
      expect(thiefIndex).toBeLessThan(sorcererIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const reviews = [
        createReviewValue({ genres: ["Thriller"], title: "Sorcerer" }),
        createReviewValue({ genres: ["Crime"], title: "Thief" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Sorcerer");
      await clickGenresFilterOption(user, "Thriller");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Sorcerer")).toBeInTheDocument();
      expect(within(posterList).queryByText("Thief")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Sorcerer")).toBeInTheDocument();
      expect(within(posterList).getByText("Thief")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const reviews = [
        createReviewValue({ title: "Sorcerer" }),
        createReviewValue({ title: "Thief" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Sorcerer");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Sorcerer")).toBeInTheDocument();
      expect(within(posterList).queryByText("Thief")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Sorcerer")).toBeInTheDocument();
      expect(within(posterList).queryByText("Thief")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Sorcerer");
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
          title: `Underseen ${i + 1}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Underseen {...baseProps} values={reviews} />);

      const posterList = getGroupedPosterList();

      // Should show first 100 movies
      expect(within(posterList).getByText("Underseen 1")).toBeInTheDocument();
      expect(within(posterList).getByText("Underseen 100")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Underseen 101"),
      ).not.toBeInTheDocument();

      await clickShowMore(user);

      // Should now show all movies
      expect(within(posterList).getByText("Underseen 101")).toBeInTheDocument();
      expect(within(posterList).getByText("Underseen 110")).toBeInTheDocument();
    });
  });
});
