import type { ReviewWithExcerpt } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Grade } from "src/components/Grade";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";
import { Still } from "src/components/Still";

export const StillImageConfig = {
  width: 480,
  height: 270,
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

export interface ListItemValue
  extends Pick<
    ReviewWithExcerpt,
    | "imdbId"
    | "sequence"
    | "title"
    | "year"
    | "date"
    | "slug"
    | "grade"
    | "principalCastNames"
    | "directorNames"
    | "excerpt"
    | "genres"
  > {
  stillImageProps: StillImageProps;
}

export function HomeListItem({
  value,
  eagerLoadImage,
}: {
  value: ListItemValue;
  eagerLoadImage: boolean;
}) {
  return (
    <li className="flow-root w-full px-gutter py-6 even:bg-subtle tablet:grid tablet:max-w-[312px] tablet:grid-rows-[auto_auto_auto_1fr_auto] tablet:gap-y-4 tablet:overflow-hidden tablet:rounded-lg tablet:bg-default tablet:p-0 tablet:pb-8 tablet:shadow-all tablet:shadow-border tablet:even:bg-default desktop:max-w-unset">
      <div className="row-start-1 row-end-1">
        <a
          href={`/reviews/${value.slug}/`}
          className="safari-border-radius-fix float-right mb-2 ml-6 block w-[calc(50%_-_12px)] max-w-[480px] overflow-hidden rounded-lg tablet:float-none tablet:m-0 tablet:w-auto tablet:rounded-none"
        >
          <Still
            title={value.title}
            year={value.year}
            imageProps={value.stillImageProps}
            width={StillImageConfig.width}
            height={StillImageConfig.height}
            className="h-auto"
            loading="lazy"
            decoding="async"
            sizes={StillImageConfig.sizes}
          />
        </a>
      </div>
      <div className="row-start-2 mb-2 tablet:m-0 tablet:px-6">
        <a
          href={`/reviews/${value.slug}/`}
          className="block text-2.5xl font-bold text-default"
        >
          {value.title}{" "}
          <span className="text-sm font-light leading-none text-muted">
            {value.year}
          </span>
        </a>
      </div>
      <div className="tablet:m-0 tablet:px-6">
        <Grade value={value.grade} height={24} />
      </div>
      <RenderedMarkdown
        text={value.excerpt}
        className="text-lg leading-normal tracking-0.3px text-muted tablet:px-6"
      />
      <div className="spacer-y-6" />
      <div className="mt-auto tablet:px-6">
        <div className="text-sm leading-4 tracking-0.5px text-subtle">
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
