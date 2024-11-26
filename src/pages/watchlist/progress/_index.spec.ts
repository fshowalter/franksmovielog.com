import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import page from "./index.astro";

describe("/watchlist/progress", () => {
  it("matches snapshot", { timeout: 20_000 }, async ({ expect }) => {
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const result = await container.renderToString(
      page as AstroComponentFactory,
      {
        partial: false,
        request: new Request(
          `https://www.franksmovielog.com/watchlist/progress/`,
        ),
      },
    );

    await expect(
      await prettier.format(result, { filepath: "index.html" }),
    ).toMatchFileSnapshot(`__snapshots__/index.html`);
  });
});
