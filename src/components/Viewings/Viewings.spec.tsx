import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

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

    await userEvent.selectOptions(fromInput, "1959");
    await userEvent.selectOptions(toInput, "1970");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1945");
    await userEvent.selectOptions(toInput, "1959");
    await userEvent.selectOptions(fromInput, "1976");
    await userEvent.selectOptions(toInput, "1950");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by viewing year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    const fieldset = screen.getByRole("group", { name: "Viewing Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2020");
    await userEvent.selectOptions(toInput, "2021");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by viewing year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    const fieldset = screen.getByRole("group", { name: "Viewing Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2020");
    await userEvent.selectOptions(toInput, "2021");
    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2020");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    await userEvent.click(screen.getByText("Show More"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
