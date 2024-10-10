import { experimental_AstroContainer as AstroContainer } from "astro/container";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import { allReviews } from "~/api/reviews.ts";

import * as OgEndpoint from "./og.jpg.ts";

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

describe("/reviews/:slug/og.jpg", () => {
  it.for(testReviews)(
    "matches file",
    { timeout: 40000 },
    async (review, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        props: {
          grade: review.grade,
          slug: review.slug,
          title: review.title,
          year: review.year,
        },
        routeType: "endpoint",
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        __dirname,
        "__image_snapshots__",
        `${review.slug}-og.jpg`,
      );

      if (!fs.existsSync(snapshotFile)) {
        fs.writeFileSync(snapshotFile, result);
      }

      const snapshot = fs.readFileSync(snapshotFile);

      void expect(result.compare(snapshot)).toBe(0);
    },
  );
});
