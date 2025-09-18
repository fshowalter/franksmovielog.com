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

import type { UnderratedProps } from "./Underrated";

import { baseProps, createReviewValue, resetTestIdCounter } from "./testHelper";
import { Underrated } from "./Underrated";

describe("Underrated", () => {
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
        createReviewValue({ releaseYear: "1959", title: "Rio Bravo" }),
        createReviewValue({ releaseYear: "1982", title: "The Thing" }),
        createReviewValue({
          releaseYear: "1986",
          title: "Big Trouble in Little China",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Rio Bravo");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Big Trouble in Little China"),
      ).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const reviews = [
        createReviewValue({ genres: ["Western"], title: "Rio Bravo" }),
        createReviewValue({ genres: ["Horror", "Sci-Fi"], title: "The Thing" }),
        createReviewValue({
          genres: ["Action", "Thriller"],
          title: "Assault on Precinct 13",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(
        <Underrated
          {...baseProps}
          distinctGenres={["Western", "Horror", "Sci-Fi", "Action", "Thriller"]}
          values={reviews}
        />,
      );

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Western");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Assault on Precinct 13"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const reviews = [
        createReviewValue({ releaseYear: "1940", title: "His Girl Friday" }),
        createReviewValue({ releaseYear: "1959", title: "Rio Bravo" }),
        createReviewValue({ releaseYear: "1982", title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(
        <Underrated
          {...baseProps}
          distinctReleaseYears={[
            "1940",
            "1950",
            "1959",
            "1960",
            "1970",
            "1980",
            "1982",
            "1990",
          ]}
          values={reviews}
        />,
      );

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1950", "1970");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("His Girl Friday"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const reviews = [
        createReviewValue({ sortTitle: "Thing", title: "The Thing" }),
        createReviewValue({
          sortTitle: "Assault on Precinct 13",
          title: "Assault on Precinct 13",
        }),
        createReviewValue({ sortTitle: "Rio Bravo", title: "Rio Bravo" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (A → Z)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const assaultIndex = allText.indexOf("Assault on Precinct 13");
      const rioIndex = allText.indexOf("Rio Bravo");
      const thingIndex = allText.indexOf("The Thing");

      expect(assaultIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(thingIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          sortTitle: "Assault on Precinct 13",
          title: "Assault on Precinct 13",
        }),
        createReviewValue({ sortTitle: "Rio Bravo", title: "Rio Bravo" }),
        createReviewValue({ sortTitle: "Thing", title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Title (Z → A)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const thingIndex = allText.indexOf("The Thing");
      const rioIndex = allText.indexOf("Rio Bravo");
      const assaultIndex = allText.indexOf("Assault on Precinct 13");

      expect(thingIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(assaultIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseSequence: 3,
          releaseYear: "1982",
          title: "The Thing",
        }),
        createReviewValue({
          releaseSequence: 1,
          releaseYear: "1940",
          title: "His Girl Friday",
        }),
        createReviewValue({
          releaseSequence: 2,
          releaseYear: "1959",
          title: "Rio Bravo",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const fridayIndex = allText.indexOf("His Girl Friday");
      const rioIndex = allText.indexOf("Rio Bravo");
      const thingIndex = allText.indexOf("The Thing");

      expect(fridayIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(thingIndex);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          releaseSequence: 1,
          releaseYear: "1940",
          title: "His Girl Friday",
        }),
        createReviewValue({
          releaseSequence: 2,
          releaseYear: "1959",
          title: "Rio Bravo",
        }),
        createReviewValue({
          releaseSequence: 3,
          releaseYear: "1982",
          title: "The Thing",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const thingIndex = allText.indexOf("The Thing");
      const rioIndex = allText.indexOf("Rio Bravo");
      const fridayIndex = allText.indexOf("His Girl Friday");

      expect(thingIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(fridayIndex);
    });

    it("sorts by grade best first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A+", gradeValue: 13, title: "The Thing" }),
        createReviewValue({ grade: "A", gradeValue: 12, title: "Rio Bravo" }),
        createReviewValue({ grade: "B+", gradeValue: 10, title: "Assault" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Best First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const thingIndex = allText.indexOf("The Thing");
      const rioIndex = allText.indexOf("Rio Bravo");
      const assaultIndex = allText.indexOf("Assault");

      expect(thingIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(assaultIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const reviews = [
        createReviewValue({ grade: "A+", gradeValue: 13, title: "The Thing" }),
        createReviewValue({ grade: "B+", gradeValue: 10, title: "Assault" }),
        createReviewValue({ grade: "A", gradeValue: 12, title: "Rio Bravo" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickSortOption(user, "Grade (Worst First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const assaultIndex = allText.indexOf("Assault");
      const rioIndex = allText.indexOf("Rio Bravo");
      const thingIndex = allText.indexOf("The Thing");

      expect(assaultIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(thingIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const reviews = [
        createReviewValue({ genres: ["Western"], title: "Rio Bravo" }),
        createReviewValue({ genres: ["Horror"], title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(
        <Underrated
          {...baseProps}
          distinctGenres={["Western", "Horror"]}
          values={reviews}
        />,
      );

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Rio Bravo");
      await clickGenresFilterOption(user, "Western");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const reviews = [
        createReviewValue({ title: "Rio Bravo" }),
        createReviewValue({ title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Rio Bravo");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Rio Bravo");
    });
  });

  describe("pagination", () => {
    it("shows more titles when clicking show more", async ({ expect }) => {
      // Create 110 reviews to force pagination
      const reviews = Array.from({ length: 110 }, (_, i) =>
        createReviewValue({
          releaseSequence: 3000 - i,
          releaseYear: String(2020 - Math.floor(i / 10)),
          reviewMonth: "January",
          reviewSequence: 110 - i, // Highest sequence first for desc sort
          reviewYear: "2020",
          title: `Underrated ${i + 1}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Underrated {...baseProps} values={reviews} />);

      const posterList = getGroupedPosterList();

      // Should show first 100 movies
      expect(within(posterList).getByText("Underrated 1")).toBeInTheDocument();
      expect(
        within(posterList).getByText("Underrated 100"),
      ).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Underrated 101"),
      ).not.toBeInTheDocument();

      await clickShowMore(user);

      // Should now show all movies
      expect(
        within(posterList).getByText("Underrated 101"),
      ).toBeInTheDocument();
      expect(
        within(posterList).getByText("Underrated 110"),
      ).toBeInTheDocument();
    });
  });
});
