import type { ReactNode } from "react";

export type FilterSectionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  selectionCount?: number;
  title: string;
};

/**
 * Collapsible filter section wrapper using native details/summary.
 * Shows selection count when collapsed and items are selected.
 * @param props - Component props
 * @param props.children - Filter field content to render in details
 * @param props.defaultOpen - Whether section should be open by default (default: false)
 * @param props.selectionCount - Number of selected items (shown in summary when > 0 and collapsed)
 * @param props.title - Section title displayed in summary
 * @returns Collapsible filter section with accessible details/summary structure
 */
export function FilterSection({
  children,
  defaultOpen = false,
  selectionCount = 0,
  title,
}: FilterSectionProps): React.JSX.Element {
  return (
    <details className="
      border-b border-default
      last:border-0
    " open={defaultOpen}>
      <summary
        className={`
          flex cursor-pointer items-center justify-between px-4 py-3 text-base
          font-medium text-default
          focus-within:bg-stripe
          hover:bg-stripe
          focus:outline-none
        `}
      >
        <span className="flex items-center gap-2">
          {/* Disclosure triangle - rotates based on open/closed state */}
          <svg
            aria-hidden="true"
            className="
              size-3 transition-transform
              [[open]>&]:rotate-90
            "
            fill="currentColor"
            viewBox="0 0 8 12"
          >
            <path d="M1.5 0L0 1.5 4.5 6 0 10.5 1.5 12 7.5 6z" />
          </svg>
          {title}
        </span>
        {/* Show selection count when collapsed and items are selected */}
        {selectionCount > 0 && (
          <span className="
            text-sm text-subtle
            [[open]>&]:hidden
          ">
            ({selectionCount} selected)
          </span>
        )}
      </summary>
      {/* Content area for filter fields */}
      <div className="px-4 pb-3">{children}</div>
    </details>
  );
}
