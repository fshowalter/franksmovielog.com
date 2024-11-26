import { experimental_AstroContainer as AstroContainer } from "astro/container";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import * as OgEndpoint from "./og.jpg.ts";

describe("/viewings/stats/:year/og.jpg", () => {
  it.for(["2012", "2024", "2022"])(
    "matches snapshot for year %i",
    { timeout: 40_000 },
    async (year, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        props: {
          year: year,
        },
        routeType: "endpoint",
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        import.meta.dirname,
        "__image_snapshots__",
        `${year}-og.jpg`,
      );

      if (!fs.existsSync(snapshotFile)) {
        fs.writeFileSync(snapshotFile, result);
      }

      const snapshot = fs.readFileSync(snapshotFile);

      expect(result.compare(snapshot)).toBe(0);
    },
  );
});
