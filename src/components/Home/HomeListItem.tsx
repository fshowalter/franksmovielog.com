import type { Review, ReviewExcerpt } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Grade } from "src/components/Grade";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";
import { Still } from "src/components/Still";

export const StillImageConfig = {
  width: 515,
  height: 303,
  sizes:
    "(min-width: 706px) 312px, (min-width: 1280) 25vw, (min-width: 1472px) 312px, 50vw",
  quality: 80,
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
    <li className="flex flex-col bg-default tablet:max-w-[47%] desktop:max-w-[31.33%]">
      <a href={`/reviews/${value.slug}/`} className="mb-6 block">
        <Still
          title={value.title}
          year={value.year}
          imageProps={value.stillImageProps}
          width={StillImageConfig.width}
          height={StillImageConfig.height}
          className="h-auto w-full"
          loading="lazy"
          decoding="async"
          sizes={StillImageConfig.sizes}
        />
      </a>
      <div className="flex grow flex-col px-container-base pb-8 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="mb-1 font-sans-narrow text-xxs font-medium uppercase leading-4 tracking-[1.1px] text-subtle">
          {formatDate(value.date)}
        </div>
        <a
          href={`/reviews/${value.slug}/`}
          className="mb-2 block text-2.5xl font-medium text-default hover:text-accent"
        >
          {value.title}{" "}
          <span className="text-sm font-normal leading-none text-muted">
            {value.year}
          </span>
        </a>
        <Grade value={value.grade} height={24} className="mb-8" />
        <RenderedMarkdown
          text={value.excerpt}
          className="mb-6 text-lg leading-normal tracking-0.3px text-muted"
        />
        <div className="mt-auto font-sans-narrow text-xxs font-medium leading-4 tracking-[1.1px] text-subtle">
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
