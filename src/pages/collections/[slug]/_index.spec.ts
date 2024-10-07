import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { allCollections } from "src/api/collections";
import { describe, it } from "vitest";

import Review from "./index.astro";

const { collections } = await allCollections();
const testSlugs = new Set(["friday-the-13th", "james-bond", "hatchet"]);

const testCollections = collections.filter((collection) => {
  return testSlugs.has(collection.slug);
});

describe("/collections/:slug", () => {
  it.for(testCollections)(
    "matches snapshot for slug $slug",
    { timeout: 10000 },
    async (collection, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      container.addClientRenderer({
        name: "@astrojs/react",
        entrypoint: "@astrojs/react/client.js",
      });

      const result = await container.renderToString(
        Review as AstroComponentFactory,
        {
          props: { slug: collection.slug },
        },
      );

      void expect(
        await prettier.format(result, { parser: "html" }),
      ).toMatchFileSnapshot(`__snapshots__/${collection.slug}.html`);
    },
  );
});
