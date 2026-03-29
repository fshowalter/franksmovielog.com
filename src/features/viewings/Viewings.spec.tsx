import { render, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import type { PosterImageProps } from "~/assets/posters";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { mediumFacetTests } from "~/components/filter-and-sort/facets/medium/mediumFacetTests";
import { releaseYearFilterFacetTests } from "~/components/filter-and-sort/facets/release-year/releaseYearFacetTests";
import { reviewedStatusFacetTests } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFacetTests";
import { titleFacetFilterTests } from "~/components/filter-and-sort/facets/title/titleFacetTests";
import { venueFacetTests } from "~/components/filter-and-sort/facets/venue/venueFacetTests";
import { viewingYearFilterFacetTests } from "~/components/filter-and-sort/facets/viewing-year/viewingYearFacetTests";
import {
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/TitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { ViewingsProps, ViewingsValue } from "./Viewings";
import type { ViewingsFiltersValues } from "./Viewings.reducer";

import {
  calculateMediumCounts,
  calculateReviewedStatusCounts,
  calculateVenueCounts,
} from "./filterViewings";
import { Viewings } from "./Viewings";
import {
  clickMediumFilterOption,
  clickNextMonthButton,
  clickPreviousMonthButton,
  getCalendar,
  getMediumFilter,
  queryNextMonthButton,
  queryPreviousMonthButton,
} from "./Viewings.testHelper";

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
  distinctMedia: ["All", "Blu-ray", "DVD", "4K UHD", "35mm", "DCP", "Digital"],
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
    "Theater",
    "Drive-In",
    "Alamo Drafthouse Cinema - One Loudoun",
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

  titleFacetFilterTests(
    (items) =>
      render(
        <Viewings
          {...createProps({
            values: items.map((item) => createViewingValue(item)),
          })}
        />,
      ),
    getCalendar,
  );

  mediumFacetTests(
    (items) =>
      render(
        <Viewings
          {...createProps({
            values: items.map((item) => createViewingValue(item)),
          })}
        />,
      ),
    getCalendar,
  );

  venueFacetTests(
    (items) =>
      render(
        <Viewings
          {...createProps({
            values: items.map((item) => createViewingValue(item)),
          })}
        />,
      ),
    getCalendar,
  );

  reviewedStatusFacetTests(
    (items) =>
      render(
        <Viewings
          {...createProps({
            values: items.map((item) => createViewingValue(item)),
          })}
        />,
      ),
    getCalendar,
  );

  releaseYearFilterFacetTests({
    distinctReleaseYears: createProps().distinctReleaseYears,
    getList: getCalendar,
    renderItems: (items) =>
      render(
        <Viewings
          {...createProps({
            values: items.map(({ releaseYear, title }) =>
              createViewingValue({ releaseYear, title }),
            ),
          })}
        />,
      ),
  });

  viewingYearFilterFacetTests({
    distinctViewingYears: createProps().distinctViewingYears,
    getList: getCalendar,
    renderItems: (items) =>
      render(
        <Viewings
          {...createProps({
            values: items.map(({ title, viewingYear }) =>
              createViewingValue({ title, viewingYear }),
            ),
          })}
        />,
      ),
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
      const allText = calendar.textContent || "";
      const newIndex = allText.indexOf("3New Viewing");
      const midIndex = allText.indexOf("2Mid Viewing");
      const oldIndex = allText.indexOf("1Old Viewing");

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

      let calendar = getCalendar();

      const februaryText = calendar.textContent || "";
      if (!februaryText.includes("February Movie")) {
        const nextBtn = queryNextMonthButton();
        if (nextBtn) {
          await user.click(nextBtn);
          calendar = getCalendar();
        }
      }

      expect(within(calendar).getByText("February Movie")).toBeInTheDocument();

      await clickPreviousMonthButton(user);

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

      const calendar = getCalendar();
      expect(within(calendar).getByText("January Movie")).toBeInTheDocument();
      expect(
        within(calendar).queryByText("February Movie"),
      ).not.toBeInTheDocument();

      await clickNextMonthButton(user);

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

      let prevMonthButton = queryPreviousMonthButton();
      let nextMonthButton = queryNextMonthButton();

      expect(prevMonthButton).toBeInTheDocument();
      expect(nextMonthButton).not.toBeInTheDocument();

      await clickSortOption(user, "Viewing Date (Oldest First)");

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

      expect(
        within(calendar).getByText("The Curse of Frankenstein"),
      ).toBeInTheDocument();
      expect(within(calendar).queryByText("The Thing")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Curse");
    });
  });

  describe("filterViewings", () => {
    const mockPosterImageProps: PosterImageProps = {
      src: "/test.png",
      srcSet: "/test.png 1x",
    };

    // AIDEV-NOTE: calculateMediumCounts uses a different data layout than venue/reviewedStatus:
    // here Movie 3 is at Theater so the Blu-ray counts differ when filtering by venue.
    describe("calculateMediumCounts", () => {
      let mockValues: ViewingsValue[];

      beforeEach(() => {
        mockValues = [
          {
            date: "2023-01-15",
            medium: "Blu-ray",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2020",
            reviewSlug: "movie-1",
            sequence: "1",
            sortTitle: "movie 1",
            title: "Movie 1",
            venue: "Home",
            viewingYear: "2023",
          },
          {
            date: "2023-02-20",
            medium: "4K UHD",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2021",
            reviewSlug: "movie-2",
            sequence: "2",
            sortTitle: "movie 2",
            title: "Movie 2",
            venue: "Home",
            viewingYear: "2023",
          },
          {
            date: "2024-03-10",
            medium: "Blu-ray",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2022",
            reviewSlug: undefined,
            sequence: "3",
            sortTitle: "movie 3",
            title: "Movie 3",
            venue: "Theater",
            viewingYear: "2024",
          },
          {
            date: "2024-04-05",
            medium: "Streaming",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2023",
            reviewSlug: "movie-4",
            sequence: "4",
            sortTitle: "movie 4",
            title: "Movie 4",
            venue: "Home",
            viewingYear: "2024",
          },
        ];
      });

      it("returns counts for all media types when no filters applied", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {};
        const counts = calculateMediumCounts(mockValues, filterValues);

        expect(counts.get("Blu-ray")).toBe(2);
        expect(counts.get("4K UHD")).toBe(1);
        expect(counts.get("Streaming")).toBe(1);
      });

      it("respects venue filter when calculating medium counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          venue: ["Home"],
        };
        const counts = calculateMediumCounts(mockValues, filterValues);

        expect(counts.get("Blu-ray")).toBe(1);
        expect(counts.get("4K UHD")).toBe(1);
        expect(counts.get("Streaming")).toBe(1);
        expect(counts.get("Theater")).toBe(undefined);
      });

      it("respects viewing year filter when calculating medium counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          viewingYear: ["2024", "2024"],
        };
        const counts = calculateMediumCounts(mockValues, filterValues);

        expect(counts.get("Blu-ray")).toBe(1);
        expect(counts.get("Streaming")).toBe(1);
        expect(counts.get("4K UHD")).toBe(undefined);
      });

      it("respects reviewed status filter when calculating medium counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          reviewedStatus: ["Reviewed"],
        };
        const counts = calculateMediumCounts(mockValues, filterValues);

        expect(counts.get("Blu-ray")).toBe(1);
        expect(counts.get("4K UHD")).toBe(1);
        expect(counts.get("Streaming")).toBe(1);
      });

      it("returns empty map when no viewings match filters", ({ expect }) => {
        const filterValues: ViewingsFiltersValues = {
          venue: ["Nonexistent"],
        };
        const counts = calculateMediumCounts(mockValues, filterValues);

        expect(counts.size).toBe(0);
      });
    });

    // AIDEV-NOTE: calculateVenueCounts and calculateReviewedStatusCounts share the same
    // data layout: Movie 2 is at Theater (reviewed), Movie 3 is at Home (not reviewed).
    describe("calculateVenueCounts", () => {
      let mockValues: ViewingsValue[];

      beforeEach(() => {
        mockValues = [
          {
            date: "2023-01-15",
            medium: "Blu-ray",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2020",
            reviewSlug: "movie-1",
            sequence: "1",
            sortTitle: "movie 1",
            title: "Movie 1",
            venue: "Home",
            viewingYear: "2023",
          },
          {
            date: "2023-02-20",
            medium: "4K UHD",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2021",
            reviewSlug: "movie-2",
            sequence: "2",
            sortTitle: "movie 2",
            title: "Movie 2",
            venue: "Theater",
            viewingYear: "2023",
          },
          {
            date: "2024-03-10",
            medium: "Blu-ray",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2022",
            reviewSlug: undefined,
            sequence: "3",
            sortTitle: "movie 3",
            title: "Movie 3",
            venue: "Home",
            viewingYear: "2024",
          },
          {
            date: "2024-04-05",
            medium: "Streaming",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2023",
            reviewSlug: "movie-4",
            sequence: "4",
            sortTitle: "movie 4",
            title: "Movie 4",
            venue: "Home",
            viewingYear: "2024",
          },
        ];
      });

      it("returns counts for all venues when no filters applied", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {};
        const counts = calculateVenueCounts(mockValues, filterValues);

        expect(counts.get("Home")).toBe(3);
        expect(counts.get("Theater")).toBe(1);
      });

      it("respects medium filter when calculating venue counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          medium: ["Blu-ray"],
        };
        const counts = calculateVenueCounts(mockValues, filterValues);

        expect(counts.get("Home")).toBe(2);
        expect(counts.get("Theater")).toBe(undefined);
      });

      it("respects viewing year filter when calculating venue counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          viewingYear: ["2024", "2024"],
        };
        const counts = calculateVenueCounts(mockValues, filterValues);

        expect(counts.get("Home")).toBe(2);
        expect(counts.get("Theater")).toBe(undefined);
      });

      it("respects reviewed status filter when calculating venue counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          reviewedStatus: ["Not Reviewed"],
        };
        const counts = calculateVenueCounts(mockValues, filterValues);

        expect(counts.get("Home")).toBe(1);
        expect(counts.get("Theater")).toBe(undefined);
      });

      it("returns empty map when no viewings match filters", ({ expect }) => {
        const filterValues: ViewingsFiltersValues = {
          medium: ["Nonexistent"],
        };
        const counts = calculateVenueCounts(mockValues, filterValues);

        expect(counts.size).toBe(0);
      });
    });

    describe("calculateReviewedStatusCounts", () => {
      let mockValues: ViewingsValue[];

      beforeEach(() => {
        mockValues = [
          {
            date: "2023-01-15",
            medium: "Blu-ray",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2020",
            reviewSlug: "movie-1",
            sequence: "1",
            sortTitle: "movie 1",
            title: "Movie 1",
            venue: "Home",
            viewingYear: "2023",
          },
          {
            date: "2023-02-20",
            medium: "4K UHD",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2021",
            reviewSlug: "movie-2",
            sequence: "2",
            sortTitle: "movie 2",
            title: "Movie 2",
            venue: "Theater",
            viewingYear: "2023",
          },
          {
            date: "2024-03-10",
            medium: "Blu-ray",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2022",
            reviewSlug: undefined,
            sequence: "3",
            sortTitle: "movie 3",
            title: "Movie 3",
            venue: "Home",
            viewingYear: "2024",
          },
          {
            date: "2024-04-05",
            medium: "Streaming",
            posterImageProps: mockPosterImageProps,
            releaseYear: "2023",
            reviewSlug: "movie-4",
            sequence: "4",
            sortTitle: "movie 4",
            title: "Movie 4",
            venue: "Home",
            viewingYear: "2024",
          },
        ];
      });

      it("returns correct counts for all status types when no filters applied", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {};
        const counts = calculateReviewedStatusCounts(mockValues, filterValues);

        expect(counts.get("All")).toBe(4);
        expect(counts.get("Reviewed")).toBe(3);
        expect(counts.get("Not Reviewed")).toBe(1);
      });

      it("respects medium filter when calculating reviewed status counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          medium: ["Blu-ray"],
        };
        const counts = calculateReviewedStatusCounts(mockValues, filterValues);

        expect(counts.get("All")).toBe(2);
        expect(counts.get("Reviewed")).toBe(1);
        expect(counts.get("Not Reviewed")).toBe(1);
      });

      it("respects venue filter when calculating reviewed status counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          venue: ["Theater"],
        };
        const counts = calculateReviewedStatusCounts(mockValues, filterValues);

        expect(counts.get("All")).toBe(1);
        expect(counts.get("Reviewed")).toBe(1);
        expect(counts.get("Not Reviewed")).toBe(0);
      });

      it("respects viewing year filter when calculating reviewed status counts", ({
        expect,
      }) => {
        const filterValues: ViewingsFiltersValues = {
          viewingYear: ["2024", "2024"],
        };
        const counts = calculateReviewedStatusCounts(mockValues, filterValues);

        expect(counts.get("All")).toBe(2);
        expect(counts.get("Reviewed")).toBe(1);
        expect(counts.get("Not Reviewed")).toBe(1);
      });

      it("returns zero counts when no viewings match filters", ({ expect }) => {
        const filterValues: ViewingsFiltersValues = {
          medium: ["Nonexistent"],
        };
        const counts = calculateReviewedStatusCounts(mockValues, filterValues);

        expect(counts.get("All")).toBe(0);
        expect(counts.get("Reviewed")).toBe(0);
        expect(counts.get("Not Reviewed")).toBe(0);
      });
    });
  });
});
