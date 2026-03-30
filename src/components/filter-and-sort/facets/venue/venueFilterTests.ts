import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import { getAnimatedDetailsDisclosureElement } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure.testHelper";
import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickCheckboxListFieldOption } from "~/components/filter-and-sort/fields/CheckboxListField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./venueFilter";

type VenueFilterItem = FilterableValue & {
  title: string;
};

/**
 * Shared test suite for the venue filter facet.
 *
 * @example
 * venueFilterTests((items) => {
 *   render(<Viewings {...baseProps} values={items.map(createValue)} />);
 * }, getCalendar);
 */
export function venueFilterTests(
  renderItems: (items: VenueFilterItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("venueFilter", () => {
    it("filters to a single venue", async ({ expect }) => {
      renderItems([
        { title: "Movie at Home", venue: "Home" },
        { title: "Movie at Theater", venue: "Theater" },
        { title: "Drive-In Movie", venue: "Drive-In" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickVenueOption(user, "Home");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Movie at Home")).toBeInTheDocument();
      expect(
        within(list).queryByText("Movie at Theater"),
      ).not.toBeInTheDocument();
      expect(
        within(list).queryByText("Drive-In Movie"),
      ).not.toBeInTheDocument();
    });

    it("filters to multiple venues (OR logic)", async ({ expect }) => {
      renderItems([
        { title: "Movie at Home", venue: "Home" },
        { title: "Movie at Theater", venue: "Theater" },
        { title: "Drive-In Movie", venue: "Drive-In" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickVenueOption(user, "Home");
      await clickVenueOption(user, "Theater");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Movie at Home")).toBeInTheDocument();
      expect(within(list).getByText("Movie at Theater")).toBeInTheDocument();
      expect(
        within(list).queryByText("Drive-In Movie"),
      ).not.toBeInTheDocument();
    });

    it("shows venue chip after applying", async ({ expect }) => {
      renderItems([
        { title: "Movie at Home", venue: "Home" },
        { title: "Movie at Theater", venue: "Theater" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickVenueOption(user, "Home");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Home filter" }),
      ).toBeInTheDocument();
    });

    it("chip removal immediately hides chip but defers list update", async ({
      expect,
    }) => {
      renderItems([
        { title: "Movie at Home", venue: "Home" },
        { title: "Movie at Theater", venue: "Theater" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickVenueOption(user, "Home");
      await clickViewResults(user);

      const list = getList();
      expect(
        within(list).queryByText("Movie at Theater"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", { name: "Remove Home filter" }),
      );

      expect(
        screen.queryByRole("button", { name: "Remove Home filter" }),
      ).not.toBeInTheDocument();
      expect(
        within(list).queryByText("Movie at Theater"),
      ).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Movie at Theater")).toBeInTheDocument();
    });
  });
}

async function clickVenueOption(user: UserEvent, value: string) {
  const filter = getAnimatedDetailsDisclosureElement("Venue");
  await clickCheckboxListFieldOption(filter, user, value);
}
