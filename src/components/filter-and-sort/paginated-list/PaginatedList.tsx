import type { ShowMoreAction } from "./paginationReducer";

import { createShowMoreAction } from "./paginationReducer";

export function PaginatedList({
  children,
  dispatch,
  totalCount,
  visibleCount,
}: {
  children: React.ReactNode;
  dispatch: React.Dispatch<ShowMoreAction>;
  totalCount: number;
  visibleCount: number;
}): React.JSX.Element {
  return (
    <div className="tablet:-mx-6 tablet:pt-10">
      {children}
      <div className="flex flex-col items-center px-container py-10">
        {totalCount > visibleCount && (
          <button
            className={`
              mx-auto w-full max-w-button transform-gpu cursor-pointer
              rounded-md bg-canvas py-5 text-center font-sans text-sm font-bold
              tracking-wide uppercase shadow-all transition-transform
              hover:scale-105 hover:drop-shadow-lg
            `}
            onClick={(): void => dispatch(createShowMoreAction())}
            type="button"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
