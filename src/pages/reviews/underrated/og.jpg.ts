import type { APIRoute } from "astro";

import path from "node:path";
import sharp from "sharp";

import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

export const GET: APIRoute = async function get() {
  const imageBuffer = await sharp(
    path.resolve(`./content/assets/backdrops/underrated.png`),
  )
    .resize(1200)
    .toFormat("png")
    .toBuffer();

  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
      title: "Underrated Surprises",
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
