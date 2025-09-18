import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewCardValue } from "~/components/review-card/ReviewCard";

import { ReviewCard } from "~/components/review-card/ReviewCard";
import { SubHeading } from "~/components/sub-heading/SubHeading";

/**
 * Props for the Home component.
 */
export type HomeProps = {
  values: ReviewCardValue[];
};

/**
 * Image configuration for home page still images.
 */
export const HomeStillImageConfig = {
  height: 360,
  sizes:
    "(min-width: 1800px) 481px, (min-width: 1280px) calc(26vw + 18px), (min-width: 780px) calc(47.08vw - 46px), 83.91vw",
  width: 640,
};

/**
 * Home page component displaying latest reviews.
 * @param props - Component props
 * @param props.values - Review card values to display
 * @returns Home page component with latest reviews
 */
export function Home({ values }: HomeProps): React.JSX.Element {
  return (
    <nav className="mx-auto max-w-(--breakpoint-desktop) bg-subtle pb-8">
      <SubHeading as="h2" className="px-container">
        Latest Reviews
      </SubHeading>
      <ul
        className={`
            flex w-full flex-col flex-wrap justify-center gap-x-[3%] pb-8
            tablet:flex-row tablet:justify-between tablet:gap-y-[6vw]
            tablet:px-container tablet:[--review-card-width:47%]
            laptop:gap-y-[3vw] laptop:[--review-card-width:31.33%]
            desktop:gap-y-14
          `}
      >
        {values.map((value) => {
          return (
            <ReviewCard
              as="li"
              imageConfig={HomeStillImageConfig}
              key={value.imdbId}
              value={value}
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
