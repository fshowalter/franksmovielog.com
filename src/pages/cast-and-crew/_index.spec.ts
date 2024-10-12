import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import Index from "./index.astro";

describe("/cast-and-crew/", () => {
  it("matches snapshot", { timeout: 10_000 }, async ({ expect }) => {
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    container.addClientRenderer({
      entrypoint: "@astrojs/react/client.js",
      name: "@astrojs/react",
    });
    const result = await container.renderToString(
      Index as AstroComponentFactory,
      { request: new Request(`https://www.franksmovielog.com/cast-and-crew/`) },
    );

    void expect(
      await prettier.format(result, { parser: "html" }),
    ).toMatchFileSnapshot(`__snapshots__/index.html`);
  });
});
