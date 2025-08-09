import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { allReviews } from "~/api/reviews";

import { getProps } from "./getProps";
import { Review } from "./Review";

const { reviews } = await allReviews();

const testSlugs = new Set([
  "event-horizon-1997",
  "hellraiser-1987", 
  "horror-express-1972",
  "night-train-to-terror-1985",
  "rio-bravo-1959",
  "the-curse-of-frankenstein-1957",
  "the-bloody-judge-1970", // Has originalTitle AND 4 countries
]);

const testReviews = reviews.filter((review) => {
  return testSlugs.has(review.slug);
});

describe("Review", () => {
  it.for(testReviews)(
    "matches snapshot for slug $slug",
    { timeout: 10_000 },
    async (review, { expect }) => {
      const props = await getProps(review.slug);

      const { asFragment } = render(<Review {...props} />);

      expect(asFragment()).toMatchSnapshot();
    },
  );
});
