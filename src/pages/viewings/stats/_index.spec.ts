import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import Index from "./index.astro";

describe("/viewings/stats/", () => {
  it("matches snapshot", { timeout: 10_000 }, async ({ expect }) => {
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({
      renderers,
    });
    const result = await container.renderToString(
      Index as AstroComponentFactory,
      {
        partial: false,
        request: new Request(`https://www.franksmovielog.com/viewings/stats/`),
      },
    );

    void expect(
      await prettier.format(result, {
        parser: "html",
      }),
    ).toMatchFileSnapshot(`__snapshots__/index.html`);
  });
});
