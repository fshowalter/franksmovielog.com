import type { ReviewWithExcerpt } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Grade } from "src/components/Grade";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";
import { Still } from "src/components/Still";

export const StillImageConfig = {
  width: 960,
  height: 540,
  sizes: "(min-width: 960px) 960px, 100vw",
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

export function HomeSplash({ value }: { value: ListItemValue }) {
  return (
    <article className="mx-auto flex max-w-[calc(480px_*_3_+_2_*_var(--gutter-width))] flex-row gap-x-[var(--gutter-width)] px-gutter pb-16 desktop:grid desktop:w-full desktop:grid-cols-[clamp(540px,66%,978px)_1fr]">
      <a
        rel="canonical"
        href={`/reviews/${value.slug}/`}
        className="still-border block max-w-[970px]"
      >
        {value.stillImageProps && (
          <Still
            title={value.title}
            year={value.year}
            width={StillImageConfig.width}
            height={StillImageConfig.height}
            sizes={StillImageConfig.sizes}
            imageProps={value.stillImageProps}
            loading={"eager"}
            className="h-auto"
            decoding={"sync"}
          />
        )}
      </a>
      <div className="flex flex-col items-center pt-4 desktop:items-start desktop:place-self-start desktop:pt-0">
        <div className="text-center font-sans text-sm font-light uppercase leading-4 tracking-0.75px text-subtle desktop:text-left desktop:leading-8">
          {formatDate(value.date)}
        </div>
        <div className="spacer-y-2" />
        <h2 className="text-[2.5rem] font-bold leading-8">
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
        <Grade value={value.grade} height={32} />
        <div className="spacer-y-6" />
        <div className="font-sans text-sm leading-4 tracking-0.5px text-subtle">
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
  );
}
