import { experimental_AstroContainer as AstroContainer } from "astro/container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import * as FeedEndpoint from "./feed.xml.ts";

describe("/feed.xml", () => {
  it("matches snapshot", { timeout: 40_000 }, async ({ expect }) => {
    const container = await AstroContainer.create();

    // @ts-expect-error astro signature is wrong
    const response = await container.renderToResponse(FeedEndpoint, {
      routeType: "endpoint",
    });

    const result = await response.text();

    void expect(
      await prettier.format(result, {
        parser: "xml",
        plugins: ["@prettier/plugin-xml"],
      }),
    ).toMatchFileSnapshot(`__snapshots__/feed.xml`);
  });
});
