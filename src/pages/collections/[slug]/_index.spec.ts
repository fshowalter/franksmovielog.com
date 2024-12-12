import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import { allCollections } from "~/api/collections";
import { normalizeScriptSrc } from "~/utils/normalizeScriptSrc";

import Review from "./index.astro";
const { collections } = await allCollections();
const testSlugs = new Set(["friday-the-13th", "hatchet", "james-bond"]);

const testCollections = collections.filter((collection) => {
  return testSlugs.has(collection.slug);
});

describe("/collections/:slug", () => {
  it.for(testCollections)(
    "matches snapshot for slug $slug",
    { timeout: 10_000 },
    async (collection, { expect }) => {
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
          props: { slug: collection.slug },
          request: new Request(
            `https://www.franksmovielog.com/collections/${collection.slug}/`,
          ),
        },
      );

      await expect(
        await prettier.format(normalizeScriptSrc(result), {
          filepath: "collection.html",
        }),
      ).toMatchFileSnapshot(`__snapshots__/${collection.slug}.html`);
    },
  );
});
