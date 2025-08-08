import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

import { getProps } from "./getProps";
import { Watchlist } from "./Watchlist";

const props = await getProps();

describe("/watchlist", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<Watchlist {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Lawyer Man");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by not-found title", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    await act(async () => {
      await userEvent.type(
        screen.getByLabelText("Title"),
        "This movie doesn't exist",
      );
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by director", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Director"),
      "Howard Hawks",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by director then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Director"),
      "Howard Hawks",
    );
    await userEvent.selectOptions(screen.getByLabelText("Director"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by performer", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Performer"),
      "Bette Davis",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by performer then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Performer"),
      "Bette Davis",
    );
    await userEvent.selectOptions(screen.getByLabelText("Performer"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by writer", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Writer"),
      "Leigh Brackett",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by writer then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Writer"),
      "Leigh Brackett",
    );

    await userEvent.selectOptions(screen.getByLabelText("Writer"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by collection", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Collection"),
      "Universal Monsters",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by collection then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Collection"),
      "Universal Monsters",
    );
    await userEvent.selectOptions(screen.getByLabelText("Collection"), "All");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1930");
    await userEvent.selectOptions(toInput, "1935");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    // Create props with more than 100 items to trigger pagination
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      genres: [],
      imdbId: `tt${String(i).padStart(7, "0")}`,
      releaseSequence: `1930-01-${String(i + 1).padStart(2, "0")}tt${String(i).padStart(7, "0")}`,
      releaseYear: "1930",
      sortTitle: `Test Movie ${String(i + 1).padStart(3, "0")}`,
      title: `Test Movie ${i + 1}`,
      viewed: false,
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    }));

    const propsWithManyValues = {
      ...props,
      values: manyValues,
    };

    render(<Watchlist {...propsWithManyValues} />);

    await userEvent.click(screen.getByText("Show More"));

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
