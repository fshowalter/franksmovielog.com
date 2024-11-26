import { experimental_AstroContainer as AstroContainer } from "astro/container";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import { allCollections } from "~/api/collections.ts";

import * as OgEndpoint from "./og.jpg.ts";

const { collections } = await allCollections();

describe("/collections/:slug/og.jpg", () => {
  it.for(collections)(
    "matches file",
    { timeout: 40_000 },
    async (collection, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        props: {
          name: collection.name,
          slug: collection.slug,
        },
        routeType: "endpoint",
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        import.meta.dirname,
        "__image_snapshots__",
        `${collection.slug}-og.jpg`,
      );

      if (!fs.existsSync(snapshotFile)) {
        fs.writeFileSync(snapshotFile, result);
      }

      const snapshot = fs.readFileSync(snapshotFile);

      expect(result.compare(snapshot)).toBe(0);
    },
  );
});
