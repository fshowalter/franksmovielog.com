import type { ReviewWithExcerpt } from "src/api/reviews";
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
    <li className="flex max-w-[30.33%] flex-col bg-default">
      <div>
        <a
          href={`/reviews/${value.slug}/`}
          className="float-right mb-2 ml-6 block tablet:float-none tablet:m-0 tablet:w-auto tablet:rounded-none"
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
      <div className="spacer-y-6" />
      <div className="flex grow flex-col pb-6 pl-[8.5%] pr-[10%]">
        <div className="font-sans-caps text-[10px] uppercase leading-4 tracking-[1.1px] text-subtle">
          {formatDate(value.date)}
        </div>
        <div className="spacer-y-1" />
        <div className="text-[22px]">
          <a
            href={`/reviews/${value.slug}/`}
            className="font-serif-semibold block text-2.5xl text-default"
          >
            {value.title}{" "}
            <span className="text-sm font-light leading-none text-muted">
              {value.year}
            </span>
          </a>
        </div>
        <div className="spacer-y-2" />
        <div>
          <Grade value={value.grade} height={24} />
        </div>
        <div className="spacer-y-8" />
        <RenderedMarkdown
          text={value.excerpt}
          className="text-lg leading-normal tracking-0.3px text-muted"
        />
        <div className="spacer-y-6" />
        <div className="mt-auto">
          <div className="font-sans text-[10px] leading-4 text-subtle">
            {value.genres.map((genre, index) => {
              if (index === 0) {
                return <span key={genre}>{genre}</span>;
              }

              return <span key={genre}> | {genre}</span>;
            })}
          </div>
        </div>
      </div>
    </li>
  );
}
