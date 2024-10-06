import path from "node:path";

import type { APIRoute, InferGetStaticPropsType } from "astro";
import sharp from "sharp";
import { allStatYears } from "src/api/yearStats";
import { OpenGraphImage } from "src/components/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const years = await allStatYears();

  return years.map((year) => {
    return {
      params: {
        year: year,
      },
      props: {
        year: year,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { year } = props as Props;

  const imageBuffer = await sharp(
    path.resolve(`./content/assets/backdrops/${year}.png`),
  )
    .resize(1200)
    .toFormat("png")
    .toBuffer();

  const jpeg = await componentToImage(
    OpenGraphImage({
      title: `${year} Stats`,
      backdrop: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
