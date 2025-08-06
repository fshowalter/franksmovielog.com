import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import { filterDrawerTests } from "~/components/ListWithFiltersLayout.testHelpers";

import { CastAndCrewMember } from "./CastAndCrewMember";
import { getProps } from "./getProps";

const props = await getProps("burt-reynolds");

describe("CastAndCrewMember", () => {
  it("renders", ({ expect }) => {
    expect.hasAssertions();

    const { asFragment } = render(<CastAndCrewMember {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<CastAndCrewMember {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Cannonball");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Sort"), "Title");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1970");
    await userEvent.selectOptions(toInput, "1980");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by review year", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2021");
    await userEvent.selectOptions(toInput, "2022");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can hide reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.click(screen.getByText("Hide Reviewed"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show hidden reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.click(screen.getByText("Hide Reviewed"));
    await userEvent.click(screen.getByText("Show Reviewed"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show director titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Director");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show director titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Director");
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show writer titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show writer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show performer titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Credits"),
      "Performer",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show performer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Credits"),
      "Performer",
    );
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more credits", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.click(screen.getByText("Show More"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("opens and closes filter drawer on mobile", async ({ expect }) => {
    await filterDrawerTests.testOpenClose(CastAndCrewMember, props, expect);
  });

  it("closes filter drawer with escape key", async ({ expect }) => {
    await filterDrawerTests.testEscapeKey(CastAndCrewMember, props, expect);
  });

  it("closes filter drawer when clicking outside", ({ expect }) => {
    filterDrawerTests.testClickOutside(CastAndCrewMember, props, expect);
  });

  it("closes filter drawer with View Results button", async ({ expect }) => {
    await filterDrawerTests.testViewResultsButton(
      CastAndCrewMember,
      props,
      expect,
    );
  });

  it("scrolls to filters on desktop instead of opening drawer", async ({
    expect,
  }) => {
    await filterDrawerTests.testDesktopScroll(CastAndCrewMember, props, expect);
  });
});
