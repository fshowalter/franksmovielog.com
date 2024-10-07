import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import Index from "./index.astro";

describe("/reviews/", () => {
  it("matches snapshot", { timeout: 10000 }, async ({ expect }) => {
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    container.addClientRenderer({
      name: "@astrojs/react",
      entrypoint: "@astrojs/react/client.js",
    });
    const result = await container.renderToString(
      Index as AstroComponentFactory,
      {},
    );

    void expect(
      await prettier.format(result, { parser: "html" }),
    ).toMatchFileSnapshot(`__snapshots__/index.html`);
  });
});
