import path from "node:path";

import type { APIRoute, InferGetStaticPropsType } from "astro";
import sharp from "sharp";
import { allCollections } from "src/api/collections";
import { OpenGraphImage } from "src/components/Collection/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const { collections } = await allCollections();

  return collections.map((collection) => {
    return {
      params: {
        slug: collection.slug,
      },
      props: {
        slug: collection.slug,
        name: collection.name,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { slug, name } = props as Props;

  const imageBuffer = await sharp(
    path.resolve(`./content/assets/backdrops/${slug}.png`),
  )
    .resize(1200)
    .toFormat("png")
    .toBuffer();

  const jpeg = await componentToImage(
    OpenGraphImage({
      name,
      backdrop: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
