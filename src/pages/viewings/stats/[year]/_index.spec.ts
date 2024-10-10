import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import YearStats from "./index.astro";

describe("/viewings/stats/:year", () => {
  it.for(["2012", "2024", "2022"])(
    "matches snapshot for year %i",
    { timeout: 10000 },
    async (year, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      const result = await container.renderToString(
        YearStats as AstroComponentFactory,
        {
          props: { year: year },
          request: new Request(
            `https://www.franksmovielog.com/viewings/stats/${year}/`,
          ),
        },
      );

      void expect(
        await prettier.format(result, { parser: "html" }),
      ).toMatchFileSnapshot(`__snapshots__/${year}.html`);
    },
  );
});
