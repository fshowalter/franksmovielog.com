import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { select } from "react-select-event";
import { describe, it } from "vitest";

import { getPropsForUnderseen } from "./getProps";
import { Underseen } from "./Underseen";

const props = await getPropsForUnderseen();

describe("Underseen", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<Underseen {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();
    render(<Underseen {...props} />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText("Title"), "Bad Seed");
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();
    // Create props with more than 100 items to trigger pagination
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      genres: [],
      grade: "B+",
      gradeValue: 8,
      imdbId: `tt${String(i).padStart(7, "0")}`,
      posterImageProps: undefined,
      releaseSequence: `1930-01-${String(i + 1).padStart(2, "0")}tt${String(i).padStart(7, "0")}`,
      releaseYear: "1930",
      reviewDate: "2023-01-01",
      reviewYear: "2023",
      slug: `test-movie-${i + 1}`,
      sortTitle: `Test Movie ${String(i + 1).padStart(3, "0")}`,
      title: `Test Movie ${i + 1}`,
    }));
    const propsWithManyValues = {
      ...props,
      values: manyValues,
    };
    render(<Underseen {...propsWithManyValues} />);
    await userEvent.click(screen.getByText("Show More"));
    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title (A → Z)", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title (Z → A)", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1983");
    await userEvent.selectOptions(toInput, "1987");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1983");
    await userEvent.selectOptions(toInput, "1987");
    await userEvent.selectOptions(fromInput, "1989");
    await userEvent.selectOptions(toInput, "1986");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();
    render(<Underseen {...props} />);

    const selectElement = screen.getByLabelText("Genres");

    await select(selectElement, ["Horror", "Comedy"]);

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
