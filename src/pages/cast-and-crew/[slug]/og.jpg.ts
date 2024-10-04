import path from "node:path";

import type { APIRoute, InferGetStaticPropsType } from "astro";
import sharp from "sharp";
import { allCastAndCrew } from "src/api/castAndCrew";
import { OpenGraphImage } from "src/components/CastAndCrewMember/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const { castAndCrew } = await allCastAndCrew();

  return castAndCrew.map((member) => {
    return {
      params: {
        slug: member.slug,
      },
      props: {
        slug: member.slug,
        name: member.name,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { slug, name } = props as Props;

  const imageBuffer = await sharp(
    path.resolve(`./content/assets/avatars/${slug}.png`),
  )
    .toFormat("png")
    .toBuffer();

  const jpeg = await componentToImage(
    OpenGraphImage({
      name,
      avatar: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
