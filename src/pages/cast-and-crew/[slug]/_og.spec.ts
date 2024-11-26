import { experimental_AstroContainer as AstroContainer } from "astro/container";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import { allCastAndCrew } from "~/api/castAndCrew.ts";

import * as OgEndpoint from "./og.jpg.ts";

const { castAndCrew } = await allCastAndCrew();

const testMembers = castAndCrew.filter(
  (member) => member.slug === "paul-thomas-anderson",
);

describe("/cast-and-crew/:slug/og.jpg", () => {
  it.for(testMembers)(
    "matches file",
    { timeout: 40_000 },
    async (member, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        props: {
          name: member.name,
          slug: member.slug,
        },
        routeType: "endpoint",
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        import.meta.dirname,
        "__image_snapshots__",
        `${member.slug}-og.jpg`,
      );

      if (!fs.existsSync(snapshotFile)) {
        fs.writeFileSync(snapshotFile, result);
      }

      const snapshot = fs.readFileSync(snapshotFile);

      expect(result.compare(snapshot)).toBe(0);
    },
  );
});
