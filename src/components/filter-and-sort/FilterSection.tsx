import type { ReactNode } from "react";

export type FilterSectionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  title: string;
};

/**
 * Collapsible filter section wrapper using native details/summary.
 * AIDEV-NOTE: Spec compliance - NO selection count shown in summary (removed per spec)
 * AIDEV-NOTE: Spec compliance - All sections open by default (matching Orbit DVD)
 * AIDEV-NOTE: Spec compliance - Disclosure triangle on far right (matching Orbit DVD)
 * @param props - Component props
 * @param props.children - Filter field content to render in details
 * @param props.defaultOpen - Whether section should be open by default (default: true)
 * @param props.title - Section title displayed in summary
 * @returns Collapsible filter section with accessible details/summary structure
 */
export function FilterSection({
  children,
  defaultOpen = true,
  title,
}: FilterSectionProps): React.JSX.Element {
  return (
    <details
      className="
        border-b border-default
        last:border-0
      "
      open={defaultOpen}
    >
      <summary
        className={`
          flex cursor-pointer items-center justify-between px-4 py-3 text-base
          font-medium text-default
          focus-within:bg-stripe
          hover:bg-stripe
          focus:outline-none
        `}
      >
        {/* Section title on left */}
        <span className="flex items-center gap-2">{title}</span>
        {/* Disclosure triangle on far right - rotates based on open/closed state */}
        <svg
          aria-hidden="true"
          className="
            ml-auto size-3 transition-transform
            [[open]>&]:rotate-90
          "
          fill="currentColor"
          viewBox="0 0 8 12"
        >
          <path d="M1.5 0L0 1.5 4.5 6 0 10.5 1.5 12 7.5 6z" />
        </svg>
      </summary>
      {/* Content area for filter fields */}
      <div className="px-4 pb-3">{children}</div>
    </details>
  );
}
