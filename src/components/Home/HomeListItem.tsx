import type { ReviewWithExcerpt } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Grade } from "src/components/Grade";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";
import { Still } from "src/components/Still";

export const StillImageConfig = {
  width: 416,
  height: 270,
  sizes: "(min-width: 512px) 512px, 100vw",
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
    <li className="flex px-pageMargin odd:bg-subtle">
      <article className="mx-auto flex max-w-[960px] flex-col items-center py-10 desktop:grid desktop:w-full desktop:grid-cols-[1fr_minmax(min-content,_435px)] desktop:grid-rows-[auto_auto_1fr] desktop:gap-x-[var(--gutter-width)]">
        <div className="pb-3 text-center text-sm font-light uppercase leading-4 tracking-0.75px text-subtle desktop:text-left desktop:leading-8">
          {formatDate(value.date)}
        </div>
        <a
          rel="canonical"
          href={`/reviews/${value.slug}/`}
          className="still-border block max-w-prose desktop:col-start-2 desktop:col-end-2 desktop:row-span-3 desktop:row-start-1 desktop:justify-end desktop:self-start"
        >
          {value.stillImageProps && (
            <Still
              title={value.title}
              year={value.year}
              width={StillImageConfig.width}
              height={StillImageConfig.height}
              sizes={StillImageConfig.sizes}
              imageProps={value.stillImageProps}
              loading={eagerLoadImage ? "eager" : "lazy"}
              className="h-auto"
              decoding={eagerLoadImage ? "sync" : "async"}
            />
          )}
        </a>
        <div className="flex max-w-prose flex-col items-center pt-4 desktop:col-span-1 desktop:col-start-1 desktop:row-start-2 desktop:items-start desktop:place-self-start desktop:pt-0">
          <h2 className="text-2.5xl font-bold leading-8">
            <a
              href={`/reviews/${value.slug}/`}
              rel="canonical"
              className="inline-block text-default"
            >
              {value.title}{" "}
              <span className="inline-block text-base font-light leading-none text-subtle">
                {value.year}
              </span>
            </a>
          </h2>
          <div className="spacer-y-4" />
          <Grade value={value.grade} height={24} />
          <div className="spacer-y-6" />
          <div className="text-sm leading-4 tracking-0.5px text-subtle">
            {value.genres.map((genre, index) => {
              if (index === 0) {
                return <span key={genre}>{genre}</span>;
              }

              return <span key={genre}> | {genre}</span>;
            })}
          </div>
          <div className="spacer-y-6" />
          <RenderedMarkdown
            text={value.excerpt}
            className="self-start text-lg leading-normal tracking-0.3px text-muted"
          />
        </div>
      </article>
    </li>
  );
}
