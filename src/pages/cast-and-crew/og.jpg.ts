import path from "node:path";

import type { APIRoute } from "astro";
import sharp from "sharp";
import { OpenGraphImage } from "src/components/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export const GET: APIRoute = async function get() {
  const imageBuffer = await sharp(
    path.resolve(`./content/assets/backdrops/cast-and-crew.png`),
  )
    .resize(1200)
    .toFormat("png")
    .toBuffer();

  const jpeg = await componentToImage(
    OpenGraphImage({
      title: "Cast & Crew",
      backdrop: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
