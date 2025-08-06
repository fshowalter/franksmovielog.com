import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import { filterDrawerTests } from "~/components/ListWithFiltersLayout.testHelpers";

import { Collection } from "./Collection";
import { getProps } from "./getProps";

const props = await getProps("shaw-brothers");

describe("Collection", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<Collection {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<Collection {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Dracula");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Sort"), "Title");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1970");
    await userEvent.selectOptions(toInput, "1980");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by review year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2021");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can hide reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.click(screen.getByText("Hide Reviewed"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show hidden reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.click(screen.getByText("Hide Reviewed"));
    await userEvent.click(screen.getByText("Show Reviewed"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.click(screen.getByText("Show More"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("opens and closes filter drawer on mobile", async ({ expect }) => {
    await filterDrawerTests.testOpenClose(Collection, props, expect);
  });

  it("closes filter drawer with escape key", async ({ expect }) => {
    await filterDrawerTests.testEscapeKey(Collection, props, expect);
  });

  it("closes filter drawer when clicking outside", ({ expect }) => {
    filterDrawerTests.testClickOutside(Collection, props, expect);
  });

  it("closes filter drawer with View Results button", async ({ expect }) => {
    await filterDrawerTests.testViewResultsButton(Collection, props, expect);
  });

  it("scrolls to filters on desktop instead of opening drawer", async ({
    expect,
  }) => {
    await filterDrawerTests.testDesktopScroll(Collection, props, expect);
  });
});
