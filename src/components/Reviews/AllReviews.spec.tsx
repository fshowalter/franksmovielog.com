import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";

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

    await userEvent.type(screen.getByLabelText("Title"), "Apostle");
    await waitFor(() => {
      expect(screen.getByTestId("list")).toBeInTheDocument();
    }, { timeout: 600 });

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
    await userEvent.selectOptions(fromInput, "1998");
    await userEvent.selectOptions(toInput, "1960");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by review year", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2021");
    await userEvent.selectOptions(toInput, "2023");

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can filter by review year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<AllReviews {...props} />);

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2021");
    await userEvent.selectOptions(toInput, "2023");
    await userEvent.selectOptions(fromInput, "2022");
    await userEvent.selectOptions(toInput, "2021");

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

    const genresButton = screen.getByLabelText("Genres");

    // Click to open the dropdown
    await userEvent.click(genresButton);

    // Select Horror
    const horrorOption = await screen.findByRole("option", { name: "Horror" });
    await userEvent.click(horrorOption);

    // Wait for dropdown to close (150ms timeout in component)
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    }, { timeout: 300 });

    // Small additional wait to ensure state is settled
    await new Promise(r => setTimeout(r, 50));

    // Click to open the dropdown again
    await userEvent.click(genresButton);

    // Select Comedy
    const comedyOption = await screen.findByRole("option", { name: "Comedy" });
    await userEvent.click(comedyOption);

    // Click outside to close the dropdown
    await userEvent.click(document.body);

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
    // Create props with more than 100 items to trigger pagination
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      genres: ["Drama"],
      grade: "B+" as const,
      gradeValue: 8,
      imdbId: `tt${String(i).padStart(7, "0")}`,
      posterImageProps: {
        src: "test.jpg",
        srcSet: "test.jpg 1x",
      },
      releaseSequence: `1930-01-${String(i + 1).padStart(2, "0")}tt${String(i).padStart(7, "0")}`,
      releaseYear: "1930",
      reviewDisplayDate: "Jan 01, 2023",
      reviewSequence: `2023-01-01-${i}`,
      reviewYear: "2023",
      slug: `test-movie-${i + 1}`,
      sortTitle: `Test Movie ${String(i + 1).padStart(3, "0")}`,
      title: `Test Movie ${i + 1}`,
    }));
    const propsWithManyValues = {
      ...props,
      values: manyValues,
    };
    render(<AllReviews {...propsWithManyValues} />);
    await userEvent.click(screen.getByText("Show More"));
    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
