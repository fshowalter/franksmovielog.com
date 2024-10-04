import fs from "node:fs";
import path from "node:path";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { allReviews } from "src/api/reviews.ts";
import { describe, it } from "vitest";

import * as OgEndpoint from "./og.jpg.ts";

const { reviews } = await allReviews();
const testSlugs = new Set([
  "the-curse-of-frankenstein-1957",
  "event-horizon-1997",
  "hellraiser-1987",
  "rio-bravo-1959",
  "night-train-to-terror-1985",
  "horror-express-1972",
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
        routeType: "endpoint",
        props: {
          slug: review.slug,
          title: review.title,
          year: review.year,
          grade: review.grade,
        },
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
