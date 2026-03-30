import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillTextField } from "~/components/filter-and-sort/fields/TextField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./nameFilter";

type NameFilterItem = FilterableValue;

export function nameFilterTests(
  renderItems: (items: NameFilterItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("nameFilter", () => {
    it("filters to matching names", async ({ expect }) => {
      renderItems([
        { name: "John Ford", sortName: "Ford, John" },
        { name: "John Huston", sortName: "Huston, John" },
        { name: "Howard Hawks", sortName: "Hawks, Howard" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillNameFilter(user, "Huston");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("John Huston")).toBeInTheDocument();
      expect(within(list).queryByText("Howard Hawks")).not.toBeInTheDocument();
      expect(within(list).queryByText("John Ford")).not.toBeInTheDocument();
    });

    it("filters by partial name match", async ({ expect }) => {
      renderItems([
        { name: "John Ford", sortName: "Ford, John" },
        { name: "John Huston", sortName: "Huston, John" },
        { name: "Howard Hawks", sortName: "Hawks, Howard" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillNameFilter(user, "John");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("John Ford")).toBeInTheDocument();
      expect(within(list).getByText("John Huston")).toBeInTheDocument();
      expect(within(list).queryByText("Howard Hawks")).not.toBeInTheDocument();
    });

    it("shows search chip after applying", async ({ expect }) => {
      renderItems([
        { name: "John Ford", sortName: "Ford, John" },
        { name: "John Huston", sortName: "Huston, John" },
        { name: "Howard Hawks", sortName: "Hawks, Howard" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillNameFilter(user, "Howard Hawks");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", {
          name: "Remove Name: Howard Hawks filter",
        }),
      ).toBeInTheDocument();
    });

    it("removing name chip defers list update until View Results", async ({
      expect,
    }) => {
      renderItems([
        { name: "John Ford", sortName: "Ford, John" },
        { name: "John Huston", sortName: "Huston, John" },
        { name: "Howard Hawks", sortName: "Hawks, Howard" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillNameFilter(user, "John Ford");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("Howard Hawks")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", {
          name: "Remove Name: John Ford filter",
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: "Remove Name: Howard Hawks filter",
        }),
      ).not.toBeInTheDocument();
      expect(within(list).queryByText("Howard Hawks")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Howard Hawks")).toBeInTheDocument();
    });

    it("resets when closing drawer without applying", async ({ expect }) => {
      renderItems([
        { name: "John Ford", sortName: "Ford, John" },
        { name: "John Huston", sortName: "Huston, John" },
        { name: "Howard Hawks", sortName: "Hawks, Howard" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillNameFilter(user, "Howard Hawks");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Howard Hawks")).toBeInTheDocument();
      expect(within(list).queryByText("John Ford")).not.toBeInTheDocument();
      expect(within(list).queryByText("John Huston")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillNameFilter(user, "Different Name");
      await clickCloseFilters(user);

      expect(within(list).getByText("Howard Hawks")).toBeInTheDocument();
      expect(within(list).queryByText("John Ford")).not.toBeInTheDocument();
      expect(within(list).queryByText("John Huston")).not.toBeInTheDocument();
    });
  });
}

async function fillNameFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Name", value);
}
