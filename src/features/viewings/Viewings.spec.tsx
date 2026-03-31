import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";
import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { mediumFacetTests } from "~/components/filter-and-sort/facets/medium/mediumFilterTests";
import { releaseYearFilterTests } from "~/components/filter-and-sort/facets/release-year/releaseYearFilterTests";
import { reviewedStatusFilterTests } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterTests";
import { titleFilterTests } from "~/components/filter-and-sort/facets/title/titleFilterTests";
import { venueFilterTests } from "~/components/filter-and-sort/facets/venue/venueFilterTests";
import { viewingDateFacetTests } from "~/components/filter-and-sort/facets/viewing-date/viewingDateSortTests";
import { viewingYearFilterTests } from "~/components/filter-and-sort/facets/viewing-year/viewingYearFilterTests";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { ViewingsProps, ViewingsValue } from "./Viewings";

import { Viewings } from "./Viewings";

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
      height: 372,
      src: "/poster.jpg",
      srcSet: "/poster.jpg 1x",
      width: 248,
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

  titleFilterTests(
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

  venueFilterTests(
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

  reviewedStatusFilterTests(
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

  releaseYearFilterTests({
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

  viewingYearFilterTests({
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

  viewingDateFacetTests(
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
});

/**
 * Clicks the next month navigation button.
 * @param user - User event instance
 */
async function clickNextMonthButton(user: UserEvent): Promise<void> {
  // Find and click the next month button first to ensure we can go back
  const nextMonthButton = await screen.findByRole("button", {
    name: /Navigate to next month:/,
  });
  await user.click(nextMonthButton);
}

/**
 * Clicks the previous month navigation button.
 * @param user - User event instance
 */
async function clickPreviousMonthButton(user: UserEvent): Promise<void> {
  // Find and click the next month button first to ensure we can go back
  const previousMonthButton = await screen.findByRole("button", {
    name: /Navigate to previous month:/,
  });
  await user.click(previousMonthButton);
}

/**
 * Gets the calendar element.
 * @returns Calendar element
 */
function getCalendar(): HTMLElement {
  return screen.getByTestId("calendar");
}

/**
 * Queries for the next month button.
 * @returns Next month button element or null
 */
function queryNextMonthButton(): HTMLElement | null {
  return screen.queryByRole("button", {
    name: /Navigate to next month:/,
  });
}

/**
 * Queries for the previous month button.
 * @returns Previous month button element or null
 */
function queryPreviousMonthButton(): HTMLElement | null {
  return screen.queryByRole("button", {
    name: /Navigate to previous month:/,
  });
}
