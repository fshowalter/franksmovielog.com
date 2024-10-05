import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import { CastAndCrew } from "./CastAndCrew";
import { getProps } from "./getProps";

const props = await getProps();

describe("CastAndCrew", () => {
  it("can filter by name", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Name"), "John Wayne");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by name desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Name (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by name asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Name (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title count desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title Count (Most First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title count asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title Count (Fewest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review count desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Count (Most First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review count asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Count (Fewest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter directors", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Director");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter directors then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Director");
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter writers", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter writers then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter performers", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Credits"),
      "Performer",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter performers then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrew {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Credits"),
      "Performer",
    );
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
