import { memo } from "react";

import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { Grade } from "~/components/Grade";

type ReviewGridItemProps = {
  value: ReviewListItemValue;
};

function ReviewGridItem({ value }: ReviewGridItemProps): React.JSX.Element {
  return (
    <li className="relative flex flex-col">
      <a className="group/list-item block" href={`/reviews/${value.slug}/`}>
        <div
          className={`
            relative mb-2 max-w-[250px] overflow-hidden rounded shadow-md
            transition-all duration-200
          `}
        >
          <img
            {...value.posterImageProps}
            alt=""
            className="aspect-[1/1.5] w-full object-cover"
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-1 px-1">
          <div
            className={`
              font-sans text-sm leading-tight font-semibold text-accent
            `}
          >
            {value.title}
            <span className="ml-1 text-xxs font-light text-subtle">
              {value.releaseYear}
            </span>
          </div>
          <div>
            <Grade height={16} value={value.grade} />
          </div>
          <div className="text-xs text-muted">{value.reviewDisplayDate}</div>
          {value.genres.length > 0 && (
            <div className="text-xs text-subtle">
              {value.genres.slice(0, 2).join(", ")}
            </div>
          )}
        </div>
      </a>
    </li>
  );
}

const MemoizedReviewGridItem = memo(ReviewGridItem);

export { MemoizedReviewGridItem as ReviewGridItem };
