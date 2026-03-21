import { render, waitFor, within } from "@testing-library/react";
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
  fillReleaseYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/TitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { ViewingsProps, ViewingsValue } from "./Viewings";

import { Viewings } from "./Viewings";
import {
  clickMediumFilterOption,
  clickNextMonthButton,
  clickPreviousMonthButton,
  clickVenueFilterOption,
  fillViewingYearFilter,
  getCalendar,
  getMediumFilter,
  queryNextMonthButton,
  queryPreviousMonthButton,
} from "./Viewings.testHelper";

// Test helpers
let testIdCounter = 0;

function createViewingValue(
  overrides: Partial<ViewingsValue> = {},
): ViewingsValue {
  testIdCounter += 1;
  const date = overrides.date || "2024-01-01";
  return {
    date,
    medium: "Blu-ray",
    posterImageProps: {
      src: "/poster.jpg",
      srcSet: "/poster.jpg 1x",
    },
    releaseYear: "1970",
    reviewSlug: `test-movie-${testIdCounter}`,
    sequence: testIdCounter.toString(),
    sortTitle: `Test Movie ${testIdCounter}`,
    title: `Test Movie ${testIdCounter}`,
    venue: "Home",
    viewingYear: "2024",
    ...overrides,
  };
}

function resetTestIdCounter(): void {
  testIdCounter = 0;
}

const createProps = (
  overrides: Partial<ViewingsProps> = {},
): ViewingsProps => ({
  distinctMedia: ["All", "Blu-ray", "DVD", "4K UHD", "35mm", "DCP"],
  distinctReleaseYears: [
    "1950",
    "1960",
    "1970",
    "1980",
    "1990",
    "2000",
    "2010",
    "2020",
  ],
  distinctVenues: [
    "All",
    "Home",
    "Alamo Drafthouse Cinema - One Loudoun",
    "Theater",
  ],
  distinctViewingYears: [
    "2012",
    "2013",
    "2014",
    "2015",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
  ],
  initialSort: "viewing-date-desc" as const,
  values: [],
  ...overrides,
});

describe("Viewings", () => {
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
      const viewings = [
        createViewingValue({
          date: "2024-01-15",
          title: "The Curse of Frankenstein",
        }),
        createViewingValue({
          date: "2024-01-16",
          title: "Curse of the Demon",
        }),
        createViewingValue({
          date: "2024-01-17",
          title: "The Thing",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Curse");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).getByText("The Curse of Frankenstein"),
      ).toBeInTheDocument();
      expect(
        within(calendar).getByText("Curse of the Demon"),
      ).toBeInTheDocument();
      expect(within(calendar).queryByText("The Thing")).not.toBeInTheDocument();
    });

    it("filters by medium", async ({ expect }) => {
      const viewings = [
        createViewingValue({ medium: "Blu-ray", title: "Movie on Blu-ray" }),
        createViewingValue({ medium: "DVD", title: "Movie on DVD" }),
        createViewingValue({ medium: "35mm", title: "Movie in Theater" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await clickMediumFilterOption(user, "Blu-ray");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).getByText("Movie on Blu-ray"),
      ).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Movie on DVD"),
      ).not.toBeInTheDocument();
      expect(
        within(calendar).queryByText("Movie in Theater"),
      ).not.toBeInTheDocument();
    });

    it("filters by reviewed status", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          reviewSlug: "reviewed-movie",
          title: "Reviewed Movie",
        }),
        createViewingValue({
          reviewSlug: undefined,
          title: "Unreviewed Movie",
        }),
        createViewingValue({
          reviewSlug: "another-reviewed",
          title: "Another Reviewed",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Reviewed Movie")).toBeInTheDocument();
      expect(
        within(calendar).getByText("Another Reviewed"),
      ).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Unreviewed Movie"),
      ).not.toBeInTheDocument();
    });

    it("filters by unreviewed status", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          reviewSlug: "reviewed-movie",
          title: "Reviewed Movie",
        }),
        createViewingValue({
          reviewSlug: undefined,
          title: "Unreviewed Movie",
        }),
        createViewingValue({
          reviewSlug: undefined,
          title: "Another Unreviewed",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Not Reviewed");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).getByText("Unreviewed Movie"),
      ).toBeInTheDocument();
      expect(
        within(calendar).getByText("Another Unreviewed"),
      ).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Reviewed Movie"),
      ).not.toBeInTheDocument();
    });

    it("filters by venue", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          title: "Movie at Alamo",
          venue: "Alamo Drafthouse Cinema - One Loudoun",
        }),
        createViewingValue({ title: "Movie at Home", venue: "Home" }),
        createViewingValue({
          title: "Another Alamo Movie",
          venue: "Alamo Drafthouse Cinema - One Loudoun",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await clickVenueFilterOption(
        user,
        "Alamo Drafthouse Cinema - One Loudoun",
      );
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Movie at Alamo")).toBeInTheDocument();
      expect(
        within(calendar).getByText("Another Alamo Movie"),
      ).toBeInTheDocument();
      expect(
        within(calendar).queryByText("Movie at Home"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const viewings = [
        createViewingValue({ releaseYear: "1950", title: "Old Movie" }),
        createViewingValue({ releaseYear: "1970", title: "Mid Movie" }),
        createViewingValue({ releaseYear: "2020", title: "New Movie" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1960", "1980");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Mid Movie")).toBeInTheDocument();
      expect(within(calendar).queryByText("Old Movie")).not.toBeInTheDocument();
      expect(within(calendar).queryByText("New Movie")).not.toBeInTheDocument();
    });

    it("filters by viewing year range", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          date: "2012-06-15",
          title: "Movie 2012",
          viewingYear: "2012",
        }),
        createViewingValue({
          date: "2013-06-15",
          title: "Movie 2013",
          viewingYear: "2013",
        }),
        createViewingValue({
          date: "2014-06-15",
          title: "Movie 2014",
          viewingYear: "2014",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(
        <Viewings
          {...createProps({
            initialSort: "viewing-date-asc",
            values: viewings,
          })}
        />,
      );

      await clickToggleFilters(user);
      await fillViewingYearFilter(user, "2012", "2013");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("Movie 2012")).toBeInTheDocument();

      await clickNextMonthButton(user);
      expect(within(calendar).getByText("Movie 2013")).toBeInTheDocument();

      const nextButton = queryNextMonthButton();
      expect(nextButton).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by viewing date newest first", ({ expect }) => {
      const viewings = [
        createViewingValue({
          date: "2024-01-01",
          sequence: "1",
          title: "Old Viewing",
        }),
        createViewingValue({
          date: "2024-01-03",
          sequence: "3",
          title: "New Viewing",
        }),
        createViewingValue({
          date: "2024-01-02",
          sequence: "2",
          title: "Mid Viewing",
        }),
      ];

      render(<Viewings {...createProps({ values: viewings })} />);

      const calendar = getCalendar();

      const movies = ["New Viewing", "Mid Viewing", "Old Viewing"];
      const foundMovies = movies.filter((movie) =>
        calendar.textContent?.includes(movie),
      );

      expect(foundMovies).toHaveLength(3);

      // Verify they're in the right order by checking their position in the calendar
      const allText = calendar.textContent || "";
      const newIndex = allText.indexOf("3New Viewing"); // Day 3
      const midIndex = allText.indexOf("2Mid Viewing"); // Day 2
      const oldIndex = allText.indexOf("1Old Viewing"); // Day 1

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });

    it("sorts by viewing date oldest first", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          date: "2024-01-03",
          title: "New Viewing",
        }),
        createViewingValue({
          date: "2024-01-01",
          title: "Old Viewing",
        }),
        createViewingValue({
          date: "2024-01-02",
          title: "Mid Viewing",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickSortOption(user, "Viewing Date (Oldest First)");

      const calendar = getCalendar();
      const allText = calendar.textContent || "";
      const oldIndex = allText.indexOf("Old Viewing");
      const midIndex = allText.indexOf("Mid Viewing");
      const newIndex = allText.indexOf("New Viewing");

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });
  });

  describe("month navigation", () => {
    it("navigates to previous month", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          date: "2024-02-15",
          sequence: "2",
          title: "February Movie",
        }),
        createViewingValue({
          date: "2024-01-15",
          sequence: "1",
          title: "January Movie",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      // Default sort is newest first (by viewingSequence), initially shows February 2024
      let calendar = getCalendar();

      // Verify we're on February
      const februaryText = calendar.textContent || "";
      if (!februaryText.includes("February Movie")) {
        // We might be on January, click next to get to February
        const nextBtn = queryNextMonthButton();
        if (nextBtn) {
          await user.click(nextBtn);
          calendar = getCalendar();
        }
      }

      expect(within(calendar).getByText("February Movie")).toBeInTheDocument();

      await clickPreviousMonthButton(user);

      // Should now show January 2024
      calendar = getCalendar();
      expect(within(calendar).getByText("January Movie")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("February Movie"),
      ).not.toBeInTheDocument();
    });

    it("navigates to next month", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          date: "2024-01-15",
          title: "January Movie",
        }),
        createViewingValue({
          date: "2024-02-15",
          title: "February Movie",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(
        <Viewings
          {...createProps({
            initialSort: "viewing-date-asc",
            values: viewings,
          })}
        />,
      );

      // Initially should show January 2024 (oldest first)
      const calendar = getCalendar();
      expect(within(calendar).getByText("January Movie")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("February Movie"),
      ).not.toBeInTheDocument();

      await clickNextMonthButton(user);

      // Should now show February 2024
      expect(within(calendar).getByText("February Movie")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("January Movie"),
      ).not.toBeInTheDocument();
    });

    it("shows correct navigation buttons", async ({ expect }) => {
      const viewings = [
        createViewingValue({
          date: "2024-01-15",
          title: "January Movie",
        }),
        createViewingValue({
          date: "2023-12-15",
          title: "December Movie",
          viewingYear: "2023",
        }),
        createViewingValue({
          date: "2024-02-15",
          title: "February Movie",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      // Default sort is newest first, showing February 2024
      let prevMonthButton = queryPreviousMonthButton();
      let nextMonthButton = queryNextMonthButton();

      // At newest month, should only have previous month button
      expect(prevMonthButton).toBeInTheDocument();
      expect(nextMonthButton).not.toBeInTheDocument();

      // Sort by oldest first
      await clickSortOption(user, "Viewing Date (Oldest First)");

      // At oldest month, should only have next month button
      prevMonthButton = queryPreviousMonthButton();
      nextMonthButton = queryNextMonthButton();

      expect(prevMonthButton).not.toBeInTheDocument();
      expect(nextMonthButton).toBeInTheDocument();
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const viewings = [
        createViewingValue({ medium: "Blu-ray", title: "The Thing" }),
        createViewingValue({ medium: "DVD", title: "Halloween" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "The Thing");
      await clickMediumFilterOption(user, "Blu-ray");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(within(calendar).getByText("The Thing")).toBeInTheDocument();
      expect(within(calendar).queryByText("Halloween")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      await waitFor(() => {
        expect(getTitleFilter()).toHaveValue("");
        expect(getMediumFilter().values).toEqual([]);
      });

      await clickViewResults(user);

      expect(within(calendar).getByText("The Thing")).toBeInTheDocument();
      expect(within(calendar).getByText("Halloween")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const viewings = [
        createViewingValue({ title: "The Curse of Frankenstein" }),
        createViewingValue({ title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Viewings {...createProps({ values: viewings })} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Curse");
      await clickViewResults(user);

      const calendar = getCalendar();
      expect(
        within(calendar).getByText("The Curse of Frankenstein"),
      ).toBeInTheDocument();
      expect(within(calendar).queryByText("The Thing")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different Movie");
      await clickCloseFilters(user);

      // Should still show originally filtered results
      expect(
        within(calendar).getByText("The Curse of Frankenstein"),
      ).toBeInTheDocument();
      expect(within(calendar).queryByText("The Thing")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Curse");
    });
  });
});
