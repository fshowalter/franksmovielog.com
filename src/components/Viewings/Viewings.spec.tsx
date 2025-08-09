import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import type { ListItemValue } from "./Viewings";

import { getProps } from "./getProps";
import { Viewings } from "./Viewings";

export const props = await getProps();

describe("Viewings", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<Viewings {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<Viewings {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Rio Bravo");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by medium", async ({ expect }) => {
    expect.hasAssertions();
    render(<Viewings {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Medium"), "Blu-ray");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by medium then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Medium"), "Blu-ray");
    await userEvent.selectOptions(screen.getByLabelText("Medium"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by venue", async ({ expect }) => {
    expect.hasAssertions();
    render(<Viewings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Venue"),
      "Alamo Drafthouse Cinema - One Loudoun",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by venue then show all", async ({ expect }) => {
    expect.hasAssertions();
    render(<Viewings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Venue"),
      "Alamo Drafthouse Cinema - One Loudoun",
    );
    await userEvent.selectOptions(screen.getByLabelText("Venue"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by viewing date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Viewing Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by viewing date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Viewing Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1957");
    await userEvent.selectOptions(toInput, "1970");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1950");
    await userEvent.selectOptions(toInput, "1957");
    await userEvent.selectOptions(fromInput, "1973");
    await userEvent.selectOptions(toInput, "1950");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by viewing year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    const fieldset = screen.getByRole("group", { name: "Viewing Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2012");
    await userEvent.selectOptions(toInput, "2014");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by viewing year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    const fieldset = screen.getByRole("group", { name: "Viewing Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2012");
    await userEvent.selectOptions(toInput, "2014");
    await userEvent.selectOptions(fromInput, "2013");
    await userEvent.selectOptions(toInput, "2012");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();
    // Create props with more than 100 items to trigger pagination
    const manyValues: ListItemValue[] = Array.from({ length: 150 }, (_, i) => ({
      medium: "Blu-ray",
      posterImageProps: {
        src: "test.jpg",
        srcSet: "test.jpg 1x",
      },
      releaseSequence: `2020-01-${String(i + 1).padStart(2, "0")}tt${String(i).padStart(7, "0")}`,
      releaseYear: "2020",
      slug: `test-movie-${i + 1}`,
      sortTitle: `Test Movie ${String(i + 1).padStart(3, "0")}`,
      title: `Test Movie ${i + 1}`,
      venue: "Home",
      viewingDate: `2023-01-${String(i + 1).padStart(2, "0")}`,
      viewingDay: String(i + 1).padStart(2, "0"),
      viewingMonth: "January",
      viewingMonthShort: "Jan",
      viewingSequence: i,
      viewingYear: "2023",
    }));
    const propsWithManyValues = {
      backdropImageProps: props.backdropImageProps,
      deck: props.deck,
      distinctMedia: props.distinctMedia,
      distinctReleaseYears: props.distinctReleaseYears,
      distinctVenues: props.distinctVenues,
      distinctViewingYears: props.distinctViewingYears,
      initialSort: props.initialSort,
      values: manyValues,
    };
    render(<Viewings {...propsWithManyValues} />);
    await userEvent.click(screen.getByText("Show More"));
    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
