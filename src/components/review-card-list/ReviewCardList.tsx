import type React from "react";

/**
 * Image configuration for home page still images.
 */
export const ReviewCardListImageConfig = {
  height: 360,
  sizes:
    "(min-width: 1800px) 481px, (min-width: 1280px) calc(26vw + 18px), (min-width: 780px) calc(47.08vw - 46px), 83.91vw",
  width: 640,
};

export function ReviewCardList({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <ul
      className={`
        flex w-full flex-col flex-wrap justify-center gap-x-[3%]
        tablet:flex-row tablet:justify-start tablet:gap-y-[6vw]
        tablet:[--card-width:47%]
        laptop:gap-y-[3vw] laptop:[--card-width:31.33%]
        desktop:gap-y-14
      `}
    >
      {children}
    </ul>
  );
}
