import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { select } from "react-select-event";
import { describe, it } from "vitest";

import { filterDrawerTests } from "~/components/ListWithFiltersLayout.testHelpers";

import { getPropsForUnderrated } from "./getProps";
import { Underrated } from "./Underrated";

const props = await getPropsForUnderrated();

describe("Underrated", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<Underrated {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<Underrated {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Arrebato");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title (A → Z)", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title (Z → A)", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();
    render(<Underrated {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1984");
    await userEvent.selectOptions(toInput, "2018");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1984");
    await userEvent.selectOptions(toInput, "2018");
    await userEvent.selectOptions(fromInput, "2021");
    await userEvent.selectOptions(toInput, "1980");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underrated {...props} />);

    const selectElement = screen.getByLabelText("Genres");

    await select(selectElement, ["Horror", "Comedy"]);

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("opens and closes filter drawer on mobile", async ({ expect }) => {
    await filterDrawerTests.testOpenClose(Underrated, props, expect);
  });

  it("closes filter drawer with escape key", async ({ expect }) => {
    await filterDrawerTests.testEscapeKey(Underrated, props, expect);
  });

  it("closes filter drawer when clicking outside", ({ expect }) => {
    filterDrawerTests.testClickOutside(Underrated, props, expect);
  });

  it("closes filter drawer with View Results button", async ({ expect }) => {
    await filterDrawerTests.testViewResultsButton(Underrated, props, expect);
  });

  it("scrolls to filters on desktop instead of opening drawer", async ({
    expect,
  }) => {
    await filterDrawerTests.testDesktopScroll(Underrated, props, expect);
  });
});
