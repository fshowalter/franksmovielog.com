import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { select } from "react-select-event";
import { describe, it } from "vitest";

import { filterDrawerTests } from "~/components/ListWithFiltersLayout.testHelpers";

import { AllReviews } from "./AllReviews";
import { getProps } from "./getProps";

const props = await getProps();

describe("AllReviews", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<AllReviews {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<AllReviews {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Human Tornado");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1973");
    await userEvent.selectOptions(toInput, "2021");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1973");
    await userEvent.selectOptions(toInput, "2021");
    await userEvent.selectOptions(fromInput, "2009");
    await userEvent.selectOptions(toInput, "1972");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by review year", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2015");
    await userEvent.selectOptions(toInput, "2020");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by review year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2015");
    await userEvent.selectOptions(toInput, "2020");
    await userEvent.selectOptions(fromInput, "2017");
    await userEvent.selectOptions(toInput, "2015");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by grade", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "B-");
    await userEvent.selectOptions(toInput, "A+");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();
    render(<AllReviews {...props} />);

    const selectElement = screen.getByLabelText("Genres");

    await select(selectElement, ["Horror", "Comedy"]);

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by grade reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Grade" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "B");
    await userEvent.selectOptions(toInput, "B+");
    await userEvent.selectOptions(fromInput, "A-");
    await userEvent.selectOptions(toInput, "B-");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    await userEvent.click(screen.getByText("Show More"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("opens and closes filter drawer on mobile", async ({ expect }) => {
    await filterDrawerTests.testOpenClose(AllReviews, props, expect);
  });

  it("closes filter drawer with escape key", async ({ expect }) => {
    await filterDrawerTests.testEscapeKey(AllReviews, props, expect);
  });

  it("closes filter drawer when clicking outside", ({ expect }) => {
    filterDrawerTests.testClickOutside(AllReviews, props, expect);
  });

  it("closes filter drawer with View Results button", async ({ expect }) => {
    await filterDrawerTests.testViewResultsButton(AllReviews, props, expect);
  });

  it("scrolls to filters on desktop instead of opening drawer", async ({
    expect,
  }) => {
    await filterDrawerTests.testDesktopScroll(AllReviews, props, expect);
  });
});
