import type { ReactNode } from "react";

import { useEffect, useRef } from "react";

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
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // AIDEV-NOTE: Smooth height/opacity transitions for filter sections
  // - Uses JavaScript to measure scrollHeight (CSS can't transition height:auto except Chrome 129+)
  // - Duration: 300ms with cubic-bezier(0.2,0.6,0.4,1) (matching Orbit DVD)
  // - Properties: height (0 ↔ scrollHeight) and opacity (0 ↔ 1)
  // - Performance: transform-gpu class moves animation to GPU layer
  // - Accessibility: Preserves native details/summary behavior completely
  // - Opening: Temporarily sets height:auto to measure, then animates from 0
  // - Closing: Forces reflow after setting pixel height to ensure smooth transition
  useEffect(() => {
    const details = detailsRef.current;
    const content = contentRef.current;
    if (!details || !content) return;

    const handleToggle = (): void => {
      const isOpening = details.open;

      if (isOpening) {
        // Opening: Measure height first (while at 0), then animate to full height
        // Temporarily remove height restriction to measure content
        content.style.height = "auto";
        const endHeight = content.scrollHeight;

        // Start from 0
        content.style.height = "0px";
        content.style.opacity = "0";

        requestAnimationFrame((): void => {
          content.style.height = `${endHeight}px`;
          content.style.opacity = "1";
        });
      } else {
        // Closing: Get current height, set to pixels, force reflow, then animate to 0
        const startHeight = content.scrollHeight;
        content.style.height = `${startHeight}px`;

        // Force reflow so browser registers the pixel height before animating
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        content.offsetHeight;

        requestAnimationFrame((): void => {
          content.style.height = "0px";
          content.style.opacity = "0";
        });
      }
    };

    const handleTransitionEnd = (e: TransitionEvent): void => {
      if (e.target !== content || e.propertyName !== "height") return;
      // Set to auto after opening (allows dynamic content growth)
      if (details.open) content.style.height = "auto";
    };

    // Set initial state (no animation on mount)
    if (defaultOpen) {
      content.style.height = "auto";
      content.style.opacity = "1";
    } else {
      content.style.height = "0px";
      content.style.opacity = "0";
    }

    details.addEventListener("toggle", handleToggle);
    content.addEventListener("transitionend", handleTransitionEnd);

    return (): void => {
      details.removeEventListener("toggle", handleToggle);
      content.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [defaultOpen]);

  return (
    <details
      className="
        group border-b border-default
        last:border-0
      "
      open={defaultOpen}
      ref={detailsRef}
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
            ml-auto size-3 transition-transform duration-300
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
      <div
        className="
          transform-gpu overflow-hidden pb-6 transition-[height,opacity]
          duration-300 ease-[cubic-bezier(0.2,0.6,0.4,1)]
        "
        ref={contentRef}
      >
        {children}
      </div>
    </details>
  );
}
