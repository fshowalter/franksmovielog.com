import type { ReactNode } from "react";

type FilterSectionProps = {
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
        group border-b border-default
        last:border-0
      "
      open={defaultOpen}
    >
      <summary
        className={`
          flex cursor-pointer items-center justify-between py-6 font-sans
          text-base font-semibold tracking-normal text-subtle
        `}
      >
        {/* Section title on left */}
        <span className="flex items-center gap-2">{title}</span>
        {/* Disclosure triangle on far right - points up when closed, rotates 180° to point down when open */}
        {/* AIDEV-NOTE: SVG points UP by default, then rotates 180° when details[open] to point DOWN */}
        <svg
          aria-hidden="true"
          className="
            ml-auto size-3 transition-transform
            group-open:rotate-180
          "
          fill="currentColor"
          viewBox="0 0 12 8"
        >
          {/* Path draws UP-pointing triangle (inverted from down-pointing) */}
          <path d="M12 6.5L10.5 8 6 3.5 1.5 8 0 6.5 6 0.5z" />
        </svg>
      </summary>
      {/* Content area for filter fields */}
      <div className="pb-6">{children}</div>
    </details>
  );
}
