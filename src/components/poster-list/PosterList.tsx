export function PosterList({
  children,
  className = "",
  onShowMore,
}: {
  children: React.ReactNode;
  className?: string;
  onShowMore?: () => void;
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
      {onShowMore && (
        <div className="flex flex-col items-center px-container py-10">
          <button
            className={`
              mx-auto w-full max-w-button transform-gpu cursor-pointer
              rounded-md bg-canvas py-5 text-center font-sans text-sm font-bold
              tracking-wide uppercase shadow-all transition-transform
              hover:scale-105 hover:drop-shadow-lg
            `}
            onClick={onShowMore}
            type="button"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
