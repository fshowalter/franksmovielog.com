/**
 * Container for displaying a responsive grid of poster items.
 * @param props - Component props
 * @param props.children - Poster list items to render
 * @param props.className - Optional CSS classes
 * @returns Responsive poster list container
 */
export function PosterList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <div className="@container/poster-list">
      {/* AIDEV-NOTE: The 250px values below cannot be extracted to a constant/variable
          because Tailwind's utility class system requires literal values at build time.
          Tailwind scans the codebase for class names and generates CSS only for the 
          classes it finds. Using dynamic values or variables would break this process
          and the styles wouldn't be generated. The repeated 250px represents the 
          minimum poster width for responsive breakpoints. */}
      <ol
        className={`
          [--poster-list-item-width:50%]
          tablet:flex tablet:flex-wrap
          @min-[calc((250px*2)+1px)]/poster-list:[--poster-list-item-width:33.33%]
          @min-[calc((250px*3)+1px)]/poster-list:[--poster-list-item-width:25%]
          @min-[calc((250px*4)+1px)]/poster-list:[--poster-list-item-width:20%]
          @min-[calc((250px*5)+1px)]/poster-list:[--poster-list-item-width:16.66%]
          ${className}
        `}
        data-testid="poster-list"
      >
        {children}
      </ol>
    </div>
  );
}
