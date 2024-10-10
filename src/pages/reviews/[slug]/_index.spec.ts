import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import { allReviews } from "~/api/reviews";

import Review from "./index.astro";

const { reviews } = await allReviews();
const testSlugs = new Set([
  "event-horizon-1997",
  "hellraiser-1987",
  "horror-express-1972",
  "night-train-to-terror-1985",
  "rio-bravo-1959",
  "the-curse-of-frankenstein-1957",
]);

const testReviews = reviews.filter((review) => {
  return testSlugs.has(review.slug);
});

describe("/reviews/:slug", () => {
  it.for(testReviews)(
    "matches snapshot for slug $slug",
    { timeout: 10000 },
    async (review, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      const result = await container.renderToString(
        Review as AstroComponentFactory,
        {
          props: { slug: review.slug },
          request: new Request(
            `https://www.franksmovielog.com/reviews/${review.slug}/`,
          ),
        },
      );

      void expect(
        await prettier.format(result, { parser: "html" }),
      ).toMatchFileSnapshot(`__snapshots__/${review.slug}.html`);
    },
  );
});
