import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import { allCastAndCrew } from "~/api/castAndCrew";

import Review from "./index.astro";

const { castAndCrew } = await allCastAndCrew();
const testSlugs = new Set(["burt-reynolds", "christopher-lee", "john-wayne"]);

const testMembers = castAndCrew.filter((member) => {
  return testSlugs.has(member.slug);
});

describe("/cast-and-crew/:slug", () => {
  it.for(testMembers)(
    "matches snapshot for slug $slug",
    { timeout: 10_000 },
    async (member, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      container.addClientRenderer({
        entrypoint: "@astrojs/react/client.js",
        name: "@astrojs/react",
      });

      const result = await container.renderToString(
        Review as AstroComponentFactory,
        {
          partial: false,
          props: { slug: member.slug },
          request: new Request(
            `https://www.franksmovielog.com/cast-and-crew/${member.slug}/`,
          ),
        },
      );

      await expect(
        await prettier.format(result, { filepath: "member.html" }),
      ).toMatchFileSnapshot(`__snapshots__/${member.slug}.html`);
    },
  );
});
