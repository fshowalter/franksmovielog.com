import type { StillImageProps } from "~/api/stills";

import { Grade } from "~/components/grade/Grade";
import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";
import { Still } from "~/components/still/Still";

/**
 * Data structure for review card content.
 */
export type ReviewCardValue = {
  creditedAs?: string[];
  excerpt: string;
  genres: readonly string[];
  grade: string;
  imdbId: string;
  releaseYear: string;
  reviewDisplayDate?: string;
  slug: string;
  stillImageProps: StillImageProps;
  title: string;
};

/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function ReviewCard({
  as = "div",
  imageConfig,
  value,
  variant = "primary",
}: {
  as?: React.ElementType;
  imageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  value: ReviewCardValue;
  variant?: "primary" | "secondary";
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        group/card relative mb-1 w-(--review-card-width) transform-gpu
        bg-default transition-transform duration-500
        tablet:mb-0
        tablet-landscape:has-[a:hover]:-translate-y-2
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        ${
          variant === "primary"
            ? `
              flex flex-col px-[8%] pt-12
              tablet:px-0 tablet:pt-0
            `
            : ``
        }
      `}
    >
      <div
        className={`
          relative mb-6 block overflow-hidden
          after:absolute after:top-0 after:left-0 after:aspect-video
          after:size-full after:bg-default after:duration-500
          group-has-[a:hover]/card:after:opacity-0
          tablet:after:inset-x-0 tablet:after:top-0
          ${variant === "primary" ? `after:opacity-15` : ``}
          ${variant === "secondary" ? `after:opacity-20` : ``}
        `}
      >
        <Still
          imageProps={value.stillImageProps}
          {...imageConfig}
          className={`
            h-auto w-full transform-gpu transition-transform duration-500
            group-has-[a:hover]/card:scale-110
          `}
          decoding="async"
          loading="lazy"
        />
      </div>
      <div
        className={`
          flex grow flex-col
          ${
            variant === "primary"
              ? `
                px-1 pb-8
                tablet:px-[8%]
                laptop:pr-[10%] laptop:pl-[8.5%]
              `
              : ""
          }
          ${
            variant === "secondary"
              ? `
                px-6 pb-6
                laptop:pr-[14%] laptop:pl-[12%]
              `
              : ""
          }
        `}
      >
        {value.reviewDisplayDate && (
          <div
            className={`
              mb-3 font-sans text-xs leading-4 font-normal tracking-wider
              text-subtle uppercase
              laptop:tracking-wide
            `}
          >
            {value.creditedAs &&
              value.creditedAs.map((value, index) => {
                if (index === 0) {
                  return value;
                }

                return `, ${value}`;
              })}
            {!value.creditedAs && value.reviewDisplayDate}
          </div>
        )}
        <a
          className={`
            mb-3 block font-medium text-default transition-all duration-500
            after:absolute after:top-0 after:left-0 after:z-sticky
            after:size-full
            hover:text-accent
            ${
              variant === "primary"
                ? `
                  text-2.5xl leading-7
                  tablet:text-2xl
                  laptop:text-2.5xl
                `
                : ""
            }
            ${variant === "secondary" ? `text-xl leading-6` : ""}
          `}
          href={`/reviews/${value.slug}/`}
        >
          {value.title}&nbsp;
          <span className="text-sm leading-none font-normal text-muted">
            {value.releaseYear}
          </span>
        </a>
        {variant === "secondary" ? (
          <Grade className="mb-4" height={18} value={value.grade} />
        ) : (
          <Grade
            className={`
              mb-5
              tablet:mb-8
            `}
            height={24}
            value={value.grade}
          />
        )}
        {value.creditedAs && (
          <div
            className={`
              -mt-4 mb-6 font-sans text-xs leading-4 font-normal tracking-wider
              text-subtle
              laptop:tracking-wide
            `}
          >
            Reviewed: {value.reviewDisplayDate}
          </div>
        )}
        <RenderedMarkdown
          className={`
            tracking-prose text-muted
            ${
              variant === "secondary"
                ? `mb-8 text-base leading-[1.6]`
                : `leading-normal mb-6 text-lg`
            }
          `}
          text={value.excerpt}
        />
        <div
          className={`
            mt-auto font-sans text-xs leading-4 tracking-wider text-subtle
            laptop:tracking-wide
          `}
        >
          {value.genres.map((genre, index) => {
            if (index === 0) {
              return <span key={genre}>{genre}</span>;
            }

            return <span key={genre}>, {genre}</span>;
          })}
        </div>
      </div>
    </Component>
  );
}
