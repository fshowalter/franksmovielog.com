import { within } from "@testing-library/react";
import { describe, it } from "vitest";

import { clickShowMore } from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

export function paginationTests(
  renderItems: (titles: string[]) => void,
  getList: () => HTMLElement,
) {
  describe("paginationReducer", () => {
    it("shows more items when Show More is clicked", async ({ expect }) => {
      const titles = Array.from({ length: 150 }, (_, i) => `Title ${i + 1}`);
      renderItems(titles);

      const list = getList();

      expect(within(list).getByText("Title 1")).toBeInTheDocument();
      expect(within(list).getByText("Title 100")).toBeInTheDocument();
      expect(within(list).queryByText("Title 101")).not.toBeInTheDocument();

      const user = getUserWithFakeTimers();
      await clickShowMore(user);

      expect(within(list).getByText("Title 101")).toBeInTheDocument();
      expect(within(list).getByText("Title 150")).toBeInTheDocument();
    });
  });
}
