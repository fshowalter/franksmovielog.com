import { act, render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { TEXT_FILTER_DEBOUNCE_MS } from "~/components/TextFilter";

import { getPropsForUnderseen } from "./getProps";
import { Underseen } from "./Underseen";

const props = await getPropsForUnderseen();

describe("Underseen", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("renders", ({ expect }) => {
    const { asFragment } = render(<Underseen {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Underseen {...props} />);

    // Get the list content before applying filter
    const beforeFilter = screen.getByTestId("grouped-poster-list").textContent;

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Title"), "Bad Seed");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filter - should show "View 0 Results" since Bad Seed doesn't exist
    const viewButton = screen.getByRole("button", { name: /View \d+ Results/ });
    await user.click(viewButton);

    // Check that the list has been filtered
    const currentList = screen.getByTestId("grouped-poster-list").textContent;
    expect(currentList).not.toBe(beforeFilter);

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
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
    render(<Underseen {...propsWithManyValues} />);
    await userEvent.click(screen.getByText("Show More"));
    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title (A → Z)", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title (Z → A)", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1983");
    await userEvent.selectOptions(toInput, "1987");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Wait for the list to update (filters to be applied)
    await waitFor(() => {
      expect(screen.getByTestId("grouped-poster-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Underseen {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1983");
    await userEvent.selectOptions(toInput, "1987");
    await userEvent.selectOptions(fromInput, "1989");
    await userEvent.selectOptions(toInput, "1986");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Wait for the list to update (filters to be applied)
    await waitFor(() => {
      expect(screen.getByTestId("grouped-poster-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();
    render(<Underseen {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const genresButton = screen.getByLabelText("Genres");

    // Click to open the dropdown
    await userEvent.click(genresButton);

    // Select Horror
    const horrorOption = await screen.findByRole("option", { name: "Horror" });
    await userEvent.click(horrorOption);

    // Wait for dropdown to close
    await waitFor(
      () => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      },
      { timeout: 300 },
    );

    // Click to open the dropdown again
    await userEvent.click(genresButton);

    // Select Comedy
    const comedyOption = await screen.findByRole("option", { name: "Comedy" });
    await userEvent.click(comedyOption);

    // Wait for dropdown to close again
    await waitFor(
      () => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      },
      { timeout: 300 },
    );

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Wait for the list to update (filters to be applied)
    await waitFor(() => {
      expect(screen.getByTestId("grouped-poster-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });
});
