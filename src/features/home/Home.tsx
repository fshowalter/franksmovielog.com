import type { StillImageProps } from "~/api/stills";

import { ReviewCardListImageConfig } from "~/components/review-card-list/ReviewCardList";
import { ReviewCard } from "~/components/review-card/ReviewCard";
import { SubHeading } from "~/components/sub-heading/SubHeading";

/**
 * Props for the Home component.
 */
export type HomeProps = {
  values: {
    excerpt: string;
    genres: readonly string[];
    grade: string;
    imdbId: string;
    releaseYear: string;
    reviewDisplayDate: string;
    slug: string;
    stillImageProps: StillImageProps;
    title: string;
  }[];
};

/**
 * Home page component displaying latest reviews.
 * @param props - Component props
 * @param props.values - Review card values to display
 * @returns Home page component with latest reviews
 */
export function Home({ values }: HomeProps): React.JSX.Element {
  return (
    <nav className="mx-auto max-w-(--breakpoint-desktop) pb-8">
      <SubHeading as="h2" className="px-container">
        Latest Reviews
      </SubHeading>
      <ul
        className={`
          flex w-full flex-col flex-wrap justify-center gap-x-[3%] pb-8
          tablet:flex-row tablet:justify-between tablet:gap-y-[6vw]
          tablet:px-container tablet:[--card-width:47%]
          laptop:gap-y-[3vw] laptop:[--card-width:31.33%]
          desktop:gap-y-14
        `}
      >
        {values.map((value) => {
          return (
            <ReviewCard
              as="li"
              excerpt={value.excerpt}
              eyebrow={value.reviewDisplayDate}
              footer={value.genres.join(", ")}
              grade={value.grade}
              key={value.imdbId}
              releaseYear={value.releaseYear}
              slug={value.slug}
              stillImageConfig={ReviewCardListImageConfig}
              stillImageProps={value.stillImageProps}
              title={value.title}
            />
          );
        })}
      </ul>
      <div
        className={`
          flex px-container py-10
          has-[a:hover]:drop-shadow-lg
        `}
      >
        <a
          className={`
            group/all-reviews mx-auto w-full max-w-button transform-gpu
            rounded-md bg-default pt-5 pb-4 text-center font-sans text-sm
            font-bold tracking-wide text-accent uppercase transition-all
            hover:scale-105 hover:bg-accent hover:text-white
          `}
          href="/reviews/"
        >
          <span
            className={`
              relative inline-block pb-1
              after:absolute after:bottom-0 after:left-0 after:h-0.5
              after:w-full after:origin-center after:scale-x-0
              after:transform-gpu after:bg-white after:transition-transform
              after:duration-500
              group-hover/all-reviews:after:scale-x-100
            `}
          >
            All Reviews
          </span>
        </a>
      </div>
    </nav>
  );
}
