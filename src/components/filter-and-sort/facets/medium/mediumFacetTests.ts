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

type MediumItem = {
  medium: string;
  title: string;
};

export async function clickMediumOption(user: UserEvent, value: string) {
  const filter = getAnimatedDetailsDisclosureElement("Medium");
  await clickCheckboxListFieldOption(filter, user, value);
}

/**
 * Shared test suite for the medium filter facet.
 *
 * @example
 * mediumFacetTests((items) => {
 *   render(<Viewings {...baseProps} values={items.map(createValue)} />);
 * }, getCalendar);
 */
export function mediumFacetTests(
  renderItems: (items: MediumItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("medium filter", () => {
    it("filters to a single medium", async ({ expect }) => {
      renderItems([
        { medium: "Blu-ray", title: "Movie on Blu-ray" },
        { medium: "DVD", title: "Movie on DVD" },
        { medium: "Digital", title: "Digital Movie" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickMediumOption(user, "Blu-ray");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Movie on Blu-ray")).toBeInTheDocument();
      expect(within(list).queryByText("Movie on DVD")).not.toBeInTheDocument();
      expect(
        within(list).queryByText("Digital Movie"),
      ).not.toBeInTheDocument();
    });

    it("filters to multiple mediums (OR logic)", async ({ expect }) => {
      renderItems([
        { medium: "Blu-ray", title: "Movie on Blu-ray" },
        { medium: "DVD", title: "Movie on DVD" },
        { medium: "Digital", title: "Digital Movie" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickMediumOption(user, "Blu-ray");
      await clickMediumOption(user, "DVD");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Movie on Blu-ray")).toBeInTheDocument();
      expect(within(list).getByText("Movie on DVD")).toBeInTheDocument();
      expect(
        within(list).queryByText("Digital Movie"),
      ).not.toBeInTheDocument();
    });

    it("shows medium chip after applying", async ({ expect }) => {
      renderItems([
        { medium: "Blu-ray", title: "Movie on Blu-ray" },
        { medium: "DVD", title: "Movie on DVD" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickMediumOption(user, "Blu-ray");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Blu-ray filter" }),
      ).toBeInTheDocument();
    });

    it("chip removal immediately hides chip but defers list update", async ({
      expect,
    }) => {
      renderItems([
        { medium: "Blu-ray", title: "Movie on Blu-ray" },
        { medium: "DVD", title: "Movie on DVD" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickMediumOption(user, "Blu-ray");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("Movie on DVD")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", { name: "Remove Blu-ray filter" }),
      );

      expect(
        screen.queryByRole("button", { name: "Remove Blu-ray filter" }),
      ).not.toBeInTheDocument();
      expect(within(list).queryByText("Movie on DVD")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Movie on DVD")).toBeInTheDocument();
    });
  });
}
