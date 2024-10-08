import type { Review, ReviewExcerpt } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Grade } from "src/components/Grade";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";
import { Still } from "src/components/Still";

export const StillImageConfig = {
  width: 640,
  height: 360,
  sizes:
    "(max-width: 767px) 100vw, (max-width: 1279px) calc((100vw - 96px) * 0.47), (max-width: 1695px) calc((100vw - 160px) * 0.3132965), 482px",
};

function formatDate(reviewDate: Date) {
  return reviewDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export type ListItemValue = Pick<
  Review,
  | "imdbId"
  | "sequence"
  | "title"
  | "year"
  | "date"
  | "slug"
  | "grade"
  | "principalCastNames"
  | "directorNames"
  | "genres"
> &
  ReviewExcerpt & {
    stillImageProps: StillImageProps;
  };

export function HomeListItem({ value }: { value: ListItemValue }) {
  return (
    <li className="relative flex flex-col bg-default tablet:max-w-[47%] desktop:max-w-[31.33%]">
      <div className="mb-6 block">
        <Still
          imageProps={value.stillImageProps}
          {...StillImageConfig}
          className="h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex grow flex-col px-[8%] pb-8 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="mb-1 font-sans text-xxs font-light uppercase leading-4 tracking-wider text-subtle desktop:tracking-wide">
          {formatDate(value.date)}
        </div>
        <a
          href={`/reviews/${value.slug}/`}
          className="mb-2 block text-2.5xl font-medium text-default before:absolute before:inset-x-0 before:top-0 before:aspect-video before:bg-[#fff] before:opacity-15 hover:text-accent hover:before:opacity-0"
        >
          {value.title}&nbsp;
          <span className="text-sm font-normal leading-none text-muted">
            {value.year}
          </span>
        </a>
        <Grade value={value.grade} height={24} className="mb-8" />
        <RenderedMarkdown
          text={value.excerpt}
          className="mb-6 text-lg leading-normal tracking-prose text-muted"
        />
        <div className="mt-auto font-sans text-xxs font-light leading-4 tracking-wider text-subtle desktop:tracking-wide">
          {value.genres.map((genre, index) => {
            if (index === 0) {
              return <span key={genre}>{genre}</span>;
            }

            return <span key={genre}> | {genre}</span>;
          })}
        </div>
      </div>
    </li>
  );
}
