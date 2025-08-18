import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

import { MultiSelectField } from "./MultiSelectField";

// Mock scrollIntoView for all tests
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

describe("MultiSelectField", () => {
  const defaultProps = {
    label: "Test Label",
    onChange: vi.fn(),
    options: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7", "Option 8"],
  };

  it("renders with label", ({ expect }) => {
    render(<MultiSelectField {...defaultProps} />);
    
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("shows placeholder when no options selected", ({ expect }) => {
    render(<MultiSelectField {...defaultProps} />);
    
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async ({ expect }) => {
    const user = userEvent.setup();
    render(<MultiSelectField {...defaultProps} />);
    
    const button = screen.getByRole("button", { name: "Test Label" });
    await user.click(button);
    
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async ({ expect }) => {
    const user = userEvent.setup();
    render(
      <div>
        <MultiSelectField {...defaultProps} />
        <button type="button">Outside</button>
      </div>
    );
    
    // Open dropdown
    const button = screen.getByRole("button", { name: "Test Label" });
    await user.click(button);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    
    // Click outside
    await user.click(screen.getByRole("button", { name: "Outside" }));
    
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("selects an option when clicked", async ({ expect }) => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MultiSelectField {...defaultProps} onChange={onChange} />);
    
    const button = screen.getByRole("button", { name: "Test Label" });
    await user.click(button);
    
    await user.click(screen.getByText("Option 1"));
    
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(["Option 1"]);
    });
  });

  it("removes selected option when X is clicked", async ({ expect }) => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MultiSelectField {...defaultProps} onChange={onChange} />);
    
    // Select an option first
    const button = screen.getByRole("button", { name: "Test Label" });
    await user.click(button);
    await user.click(screen.getByText("Option 1"));
    
    // Remove the option
    const removeButton = screen.getByRole("button", { name: "Remove Option 1" });
    await user.click(removeButton);
    
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("clears all selections when clear button is clicked", async ({ expect }) => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MultiSelectField {...defaultProps} onChange={onChange} />);
    
    // Select multiple options
    const button = screen.getByRole("button", { name: "Test Label" });
    await user.click(button);
    await user.click(screen.getByText("Option 1"));
    await user.click(screen.getByText("Option 2"));
    
    // Clear all
    const clearButton = screen.getByRole("button", { name: "Clear all selections" });
    await user.click(clearButton);
    
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  describe("Keyboard Navigation", () => {
    it("opens dropdown with Enter key", async ({ expect }) => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      button.focus();
      await user.keyboard("{Enter}");
      
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("navigates options with arrow keys", async ({ expect }) => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      // Navigate down
      await user.keyboard("{ArrowDown}");
      
      // Check that first option is highlighted by looking for the bg-stripe class
      const options = screen.getAllByRole("option");
      expect(options[0].className).toContain("bg-stripe");
      
      // Navigate down again
      await user.keyboard("{ArrowDown}");
      expect(options[1].className).toContain("bg-stripe");
      
      // Navigate up
      await user.keyboard("{ArrowUp}");
      expect(options[0].className).toContain("bg-stripe");
    });

    it("selects option with click", async ({ expect }) => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} onChange={onChange} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      // Click on the first option
      const firstOption = screen.getByText("Option 1");
      await user.click(firstOption);
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(["Option 1"]);
      });
    });

    it("closes dropdown with Escape key", async ({ expect }) => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      
      // Focus the listbox and press Escape
      const listbox = screen.getByRole("listbox");
      listbox.focus();
      await user.keyboard("{Escape}");
      
      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });
  });

  describe("Dropdown Positioning", () => {
    it("positions dropdown below button when sufficient space", ({ expect }) => {
      render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      act(() => {
        button.click();
      });
      
      const dropdown = screen.getByRole("listbox").parentElement;
      expect(dropdown?.className).toContain("top-full");
    });

    it("calculates dropdown height based on available options", async ({ expect }) => {
      const user = userEvent.setup();
      const fewOptions = ["Option 1", "Option 2"];
      
      render(<MultiSelectField {...defaultProps} options={fewOptions} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      const dropdown = screen.getByRole("listbox").parentElement;
      // With 2 options and MIN_VISIBLE_ITEMS = 3, should show space for 3 items
      expect(dropdown?.style.maxHeight).toBe("120px"); // 3 * 40px
    });

    it("limits dropdown height to MAX_VISIBLE_ITEMS", async ({ expect }) => {
      const user = userEvent.setup();
      const manyOptions = Array.from({ length: 20 }, (_, i) => `Option ${i + 1}`);
      
      render(<MultiSelectField {...defaultProps} options={manyOptions} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      const dropdown = screen.getByRole("listbox").parentElement;
      // Should be limited to MAX_VISIBLE_ITEMS = 7
      expect(dropdown?.style.maxHeight).toBe("280px"); // 7 * 40px
    });

    it("recalculates position when options change", async ({ expect }) => {
      const user = userEvent.setup();
      const { rerender } = render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      // Select some options to reduce available options
      await user.click(screen.getByText("Option 1"));
      await user.click(screen.getByText("Option 2"));
      await user.click(screen.getByText("Option 3"));
      
      // Dropdown should recalculate height
      const dropdown = screen.getByRole("listbox").parentElement;
      // 5 remaining options, should show 5 * 40px
      expect(dropdown?.style.maxHeight).toBe("200px");
    });
  });

  describe("Fieldset Parent Detection", () => {
    it("uses fieldset boundaries when inside fieldset", ({ expect }) => {
      render(
        <fieldset>
          <legend>Test Fieldset</legend>
          <MultiSelectField {...defaultProps} />
        </fieldset>
      );
      
      const button = screen.getByRole("button", { name: "Test Label" });
      act(() => {
        button.click();
      });
      
      // Should find and use fieldset parent for calculations
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("falls back to viewport when no fieldset parent", ({ expect }) => {
      render(
        <div>
          <MultiSelectField {...defaultProps} />
        </div>
      );
      
      const button = screen.getByRole("button", { name: "Test Label" });
      act(() => {
        button.click();
      });
      
      // Should still work without fieldset
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("Scroll and Resize Handlers", () => {
    it("adds resize listener when dropdown is open", async ({ expect }) => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      const user = userEvent.setup();
      
      render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it("removes listeners when component unmounts", async ({ expect }) => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const user = userEvent.setup();
      
      const { unmount } = render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      // Unmount the component
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", async ({ expect }) => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      
      // Closed state
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveAttribute("aria-haspopup", "listbox");
      
      // Open state
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");
      expect(button).toHaveAttribute("aria-controls", expect.any(String));
      
      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("aria-multiselectable", "true");
      expect(listbox).toHaveAttribute("aria-labelledby", expect.any(String));
    });

    it("manages focus correctly", async ({ expect }) => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);
      
      const button = screen.getByRole("button", { name: "Test Label" });
      await user.click(button);
      
      // Select an option
      await user.click(screen.getByText("Option 1"));
      
      // Focus should return to button after selection
      await waitFor(() => {
        expect(button).toHaveFocus();
      });
    });
  });
});